import { Injectable } from '@nestjs/common';
import { AuthenticatedUser } from '@Common';
import { PrismaService } from 'src/prisma';
import {
  AddBookDto,
  AddMoreCopies,
  UpdateBookDto,
  FindAllBookQueryDto,
} from './dto';
import { assertAdminOrLibrarian, findBookConflict } from './helpers';
import { BOOKSTATUS } from 'src/generated/prisma/enums';
@Injectable()
export class LibraryService {
  constructor(private readonly prisma: PrismaService) {}

  async addBookInLibrary(ctx: AuthenticatedUser, dto: AddBookDto) {
    assertAdminOrLibrarian(ctx);

    const book = await this.prisma.$transaction(async (tx) => {
      const existingBook = await findBookConflict(tx, dto);
      if (existingBook) {
        throw new Error('Book already exists');
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
      message: 'Book created successfully',
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
      throw new Error(`Book  with ID ${bookId}  not found `);
    }

    if (existingBook.status === BOOKSTATUS.RENTED) {
      throw new Error('Rented books can not updated');
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
      },
    });

    if (!book) {
      throw Error('book  not found ');
    }

    return {
      message: 'book featch successFully ',
      book,
    };
  }

  async findAllBook(query: FindAllBookQueryDto) {
    const { page = 1, limit = 10, search } = query;

    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' as const } },
            { author: { contains: search, mode: 'insensitive' as const } },
            { description: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [books, total] = await this.prisma.$transaction([
      this.prisma.book.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'asc',
        },
      }),
      this.prisma.book.count({ where }),
    ]);

    if (books.length === 0) {
      throw new Error('No books found');
    }

    return {
      message: 'Books fetched successfully',
      data: books,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
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
      message: ' book delete successfully ',
    };
  }

  async addMoreCopies(bookId: number, dto: AddMoreCopies) {
    const addBook = await this.prisma.book.update({
      where: { id: bookId },
      data: {
        totalCopies: { increment: dto.additionalCopies },
        availableCopies: { increment: dto.additionalCopies },
      },
    });

    return {
      message: 'book coopis add successfully',
      addBook,
    };
  }
}
