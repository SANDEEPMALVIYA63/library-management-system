import {
  Controller,
  Post,
  Req,
  Param,
  ParseIntPipe,
  Body,
  UseGuards,
  Get,
} from '@nestjs/common';
import {
  JwtAuthGuard,
  AccessGuard,
  RolesGuard,
  Roles,
  UserType,
} from '@Common';
import { RentalService } from './rental.service';
import { AuthenticatedRequest, BaseController } from '@Common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { CreateRentalDto } from './dto';
@ApiTags('rental')
@ApiBearerAuth()
@Roles(UserType.USER)
@UseGuards(JwtAuthGuard, AccessGuard, RolesGuard)
@Controller('rental')
export class RentalController extends BaseController {
  constructor(private readonly rentalService: RentalService) {
    super();
  }

  @Post()
  @ApiOperation({ summary: ' rent a book ' })
  async rentBook(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateRentalDto,
  ) {
    const ctx = this.getContext(req);
    return this.rentalService.rentBook(dto, ctx.user);
  }

  @Post(':id')
  @ApiOperation({ summary: ' return a book member' })
  async returnBook(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) rentalId: number,
  ) {
    const ctx = this.getContext(req);
    return this.rentalService.returnBook(ctx.user, rentalId);
  }

  @Get('rented-books')
  @ApiOperation({ summary: 'Get all rented books' })
  async getRentedBooks() {
    return this.rentalService.getRentedBooks();
  }

  @Get('book/:bookId/renter')
  @ApiOperation({ summary: 'Get who has rented a specific book' })
  @ApiParam({ name: 'bookId', example: 1 })
  async getWhoRentedBook(@Param('bookId', ParseIntPipe) bookId: number) {
    return this.rentalService.getWhoRentedBook(bookId);
  }

  @Get('available-books')
  @ApiOperation({ summary: 'Get all available books' })
  async getAvailableBooks() {
    return this.rentalService.getAvailableBooks();
  }
}
