import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { CreateRentalDto } from './dto';
import { AuthenticatedUser } from '@Common';
import { calculateDueDate } from './helpers';
import {
  BookStatus,
  MemberStatus,
  RentalStatus,
} from 'src/generated/prisma/enums';

@Injectable()
export class RentalService {
  constructor(private readonly prisma: PrismaService) {}

  async rentBook(dto: CreateRentalDto, UserId: AuthenticatedUser) {
    const { memberId, bookId, rentalDays } = dto;

    const member = await this.prisma.member.findUnique({
      where: { id: memberId },
    });
    if (!member) {
      throw new NotFoundException(`Member is not found id "${memberId}" `);
    }
    if (member.status !== MemberStatus.ACTIVE) {
      throw new BadRequestException(
        `Member "${member.id}" is not active and cannot rent books.`,
      );
    }

    const book = await this.prisma.book.findUnique({
      where: { id: bookId },
    });

    if (!book) {
      throw new NotFoundException(`Book with id "${bookId}" not found.`);
    }

    if (book.status !== BookStatus.ACTIVE) {
      throw new BadRequestException(
        `Book "${book.id}" is not active and cannot be rented.`,
      );
    }

    if (book.availableCopies <= 0) {
      throw new ConflictException(
        `Book "${book.title}" has no available copies at this time.`,
      );
    }
    if (!Number.isInteger(rentalDays) || rentalDays <= 0) {
      throw new BadRequestException('rentalDays must be a positive integer.');
    }

    try {
      const rental = await this.prisma.$transaction(async (tx) => {
        const updatedBook = await tx.book.updateMany({
          where: {
            id: bookId,
            availableCopies: { gt: 0 },
          },
          data: {
            status: BookStatus.RENTED,
            availableCopies: { decrement: 1 },
          },
        });

        if (updatedBook.count === 0) {
          throw new ConflictException(
            `Book "${book.title}" has no available copies at this time.`,
          );
        }

        const newRental = await tx.rental.create({
          data: {
            memberId,
            bookId,
            userId: UserId.id,
            rentalDays,
            status: RentalStatus.RENTED,
            dueDate: calculateDueDate(rentalDays),
          },
          include: {
            member: {
              select: {
                id: true,
                firstname: true,
                lastname: true,
                email: true,
              },
            },
            book: { select: { id: true, title: true, author: true } },
            user: {
              select: {
                id: true,
                firstname: true,
                lastname: true,
                email: true,
              },
            },
          },
        });
        return newRental;
      });

      return {
        message: 'book give a rent ',
        rental,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `1An unexpected error occurred while creating the rental ${error}`,
      );
    }
  }

  async returnBook(userId: AuthenticatedUser, rentalId: number) {
    const rental = await this.prisma.rental.findUnique({
      where: { id: rentalId },
      include: {
        book: { select: { id: true, title: true } },
      },
    });

    if (!rental) {
      throw new NotFoundException(`Rental with id "${rentalId}" not found.`);
    }

    if (rental.status === RentalStatus.RETURNED) {
      throw new ConflictException(
        `Rental "${rentalId}" has already been returned.`,
      );
    }

    if (
      rental.status !== RentalStatus.RENTED &&
      rental.status !== RentalStatus.OVERDUE
    ) {
      throw new BadRequestException(
        `Rental "${rentalId}" is in an invalid state for return: ${rental.status}.`,
      );
    }

    try {
      const updatedRental = await this.prisma.$transaction(async (tx) => {
        const returned = await tx.rental.update({
          where: { id: rentalId },
          data: {
            status: RentalStatus.RETURNED,
            userId: userId.id,
            returnedAt: new Date(),
          },
          include: {
            member: {
              select: {
                id: true,
                firstname: true,
                lastname: true,
                email: true,
              },
            },
            book: { select: { id: true, title: true, author: true } },
            user: {
              select: {
                id: true,
                firstname: true,
                lastname: true,
                email: true,
              },
            },
          },
        });

        await tx.book.update({
          where: { id: rental.bookId },
          data: {
            availableCopies: { increment: 1 },
          },
        });

        return returned;
      });

      return updatedRental;
    } catch (error) {
      throw new InternalServerErrorException(
        `An unexpected error occurred while returning the rental. ${error}`,
      );
    }
  }

  async getRentedBooks() {
    const rentals = await this.prisma.rental.findMany({
      where: {
        status: RentalStatus.RENTED,
      },
      orderBy: {
        createdAt: 'asc',
      },
      include: {
        member: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
          },
        },
        book: {
          select: {
            id: true,
            title: true,
            author: true,
            description: true,
            category: true,
            language: true,
            publishYear: true,
            pages: true,
            edition: true,
          },
        },
        user: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
          },
        },
      },
    });
    if (!rentals) {
      throw new Error('rentals not found');
    }
    return {
      message: 'Rented books fetched successfully',
      data: rentals,
    };
  }

  async getWhoRentedBook(bookId: number) {
    const rentals = await this.prisma.rental.findMany({
      where: {
        bookId,
        status: RentalStatus.RENTED,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        member: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
          },
        },

        book: {
          select: {
            id: true,
            title: true,
            author: true,
            description: true,
            category: true,
            language: true,
            publishYear: true,
            pages: true,
            edition: true,
          },
        },
      },
    });

    if (!rentals.length) {
      throw new NotFoundException(
        `No active rental found for book id ${bookId}`,
      );
    }

    return {
      message: 'Book renter details fetched successfully',
      data: rentals,
    };
  }

  async getAvailableBooks() {
    const books = await this.prisma.book.findMany({
      where: {
        status: BookStatus.ACTIVE,
        availableCopies: {
          gt: 0,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      message: 'Available books fetched successfully',
      data: books,
    };
  }
}
