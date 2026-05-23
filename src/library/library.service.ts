import { Injectable } from '@nestjs/common';
import { AuthenticatedUser } from '@Common';
import { PrismaService } from 'src/prisma';
import { AddBookDto, AddMoreCopies, UpdateBookDto } from './dto';
import {
  assertAdminOrLibrarian,
  findBookConflict,
  // cleanNumber,
  // cleanString,
} from './helpers';
import { BookStatus } from 'src/generated/prisma/enums';
@Injectable()
export class LibraryService {
  constructor(private readonly prisma: PrismaService) {}

  async addBookInLibrary(ctx: AuthenticatedUser, dto: AddBookDto) {
    // console.log('ctx', ctx.);

    assertAdminOrLibrarian(ctx);

    const book = await this.prisma.$transaction(async (tx) => {
      const existingBook = await findBookConflict(tx, dto);
      if (existingBook) {
        // if (existingBook.isbn === dto.isbn) {
        //   throw new ConflictException(
        //     `Book with ISBN "${dto.isbn}" already exists`,
        //   );
        // }
        throw new Error('Book already Add');
      }

      return await tx.book.create({
        data: {
          title: dto.title,
          author: dto.author,
          description: dto.description,
          language: dto.language,
          category: dto.category,
          totalCopies: dto.totalCopies,
          availableCopies: dto.totalCopies,
          publishYear: dto.publishYear?.toString(),
          pages: dto.pages,
          edition: dto.edition,
          userId: ctx.id,
        },
        select: {
          id: true,
          title: true,
          author: true,
          language: true,
          category: true,
          totalCopies: true,
          availableCopies: true,
          createdAt: true,
        },
      });
    });

    return {
      message: `book create successFully `,
      book,
    };
  }

  async updateBookInLibrary(
    ctx: AuthenticatedUser,
    bookId: number,
    dto: UpdateBookDto,
  ) {
    assertAdminOrLibrarian(ctx);
    const existingBook = await this.prisma.book.findUnique({
      where: { id: bookId },
    });
    if (!existingBook) {
      throw new Error(`Book ${bookId}  not found `);
    }

    if (existingBook.status === BookStatus.RENTED) {
      throw new Error('RENTED book Does not update');
    }
    const newAvailableCopies = existingBook.availableCopies;

    const updatedBook = await this.prisma.book.update({
      where: { id: bookId },
      data: {
        title: dto.title ?? existingBook.title,
        author: dto.author ?? existingBook.author,
        description: dto.description ?? existingBook.description,
        language: dto.language ?? existingBook.language,
        category: dto.category ?? existingBook.category,
        publishYear: dto.publishYear?.toString() ?? existingBook.publishYear,
        pages: dto.pages ?? existingBook.pages,
        edition: dto.edition ?? existingBook.edition,
        userId: ctx.id,
        ...(dto.totalCopies !== undefined && {
          totalCopies: dto.totalCopies,
          availableCopies: newAvailableCopies,
        }),
      },
    });

    return {
      message: 'book update successFully',
      updatedBook,
    };
  }

  async getBookById(bookId: number) {
    if (!Number.isInteger(bookId) || bookId <= 0) {
      throw new Error('Invalid book ID');
    }
    const book = await this.prisma.book.findUnique({
      where: { id: bookId },
      select: {
        id: true,
        title: true,
        author: true,
        description: true,
        language: true,
        category: true,
        status: true,
        totalCopies: true,
        availableCopies: true,
        publishYear: true,
        pages: true,
        edition: true,
        createdAt: true,
        updatedAt: true,
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

    if (!book) {
      throw Error('book not found ');
    }

    return {
      message: 'book find successFully ',
      book,
    };
  }

  async findAllBook() {
    const books = await this.prisma.book.findMany({
      orderBy: {
        createdAt: 'asc',
      },
      include: {
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
    if (!books) {
      throw new Error('something went wrong when found a all book ');
    }

    return books;
  }

  async deleteBook(bookId: number) {
    if (!Number.isInteger(bookId) || bookId <= 0) {
      throw Error('Invalid book ID');
    }

    const existingBook = await this.prisma.book.findUnique({
      where: { id: bookId },
    });

    if (!existingBook) {
      throw new Error('Book not found');
    }
    await this.prisma.book.delete({
      where: { id: bookId },
    });

    return {
      message: ` book delete successfully`,
    };
  }

  async addMoreCopies(bookId: number, dto: AddMoreCopies) {
    return await this.prisma.book.update({
      where: { id: bookId },
      data: {
        totalCopies: { increment: dto.additionalCopies },
        availableCopies: { increment: dto.additionalCopies },
      },
    });
  }
}
