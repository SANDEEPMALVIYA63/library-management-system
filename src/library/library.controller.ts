import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Param,
  ParseIntPipe,
  Get,
  Delete,
  Patch,
} from '@nestjs/common';
import { LibraryService } from './library.service';

import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { AddBookDto, AddMoreCopies, UpdateBookDto } from './dto';
import {
  JwtAuthGuard,
  AccessGuard,
  RolesGuard,
  Roles,
  UserType,
  AuthenticatedRequest,
  BaseController,
} from '@Common';
@ApiTags('Book')
@ApiBearerAuth()
@Roles(UserType.USER)
@UseGuards(JwtAuthGuard, AccessGuard, RolesGuard)
@Controller('Book')
export class LibraryController extends BaseController {
  constructor(private readonly libraryService: LibraryService) {
    super();
  }

  @Post()
  @ApiOperation({ summary: 'AddBook-In-Library' })
  async addBook(@Req() req: AuthenticatedRequest, @Body() dto: AddBookDto) {
    const ctx = this.getContext(req);
    return this.libraryService.addBookInLibrary(ctx.user, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update-Book-In-Library' })
  async updateBook(
    @Param('id', ParseIntPipe) BookId: number,
    @Req() req: AuthenticatedRequest,
    @Body() dto: UpdateBookDto,
  ) {
    const ctx = this.getContext(req);

    return this.libraryService.updateBookInLibrary(ctx.user, BookId, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get books By Id  ' })
  @Roles(UserType.ADMIN, UserType.LIBRARIAN, UserType.USER)
  async findBookById(@Param('id', ParseIntPipe) id: number) {
    return this.libraryService.getBookById(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all books ' })
  @Roles(UserType.ADMIN, UserType.LIBRARIAN, UserType.USER)
  async findAllBokk() {
    return this.libraryService.findAllBook();
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Get  Delete books By Id  ' })
  async deleteBookById(@Param('id', ParseIntPipe) id: number) {
    return this.libraryService.deleteBook(id);
  }

  @Post(':id')
  @ApiOperation({ summary: 'Add more  book copies ' })
  async addMoreBookCopis(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AddMoreCopies,
  ) {
    return this.libraryService.addMoreCopies(id, dto);
  }
}
