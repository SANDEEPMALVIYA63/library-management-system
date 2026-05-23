import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class CreateRentalDto {
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  memberId!: number;

  @ApiProperty({ example: 10 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  bookId!: number;

  @ApiProperty({ example: 7 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  rentalDays!: number;
}
