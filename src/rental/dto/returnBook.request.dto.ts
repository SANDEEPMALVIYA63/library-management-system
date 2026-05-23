import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class ReturnRentalDto {
  @ApiProperty({ example: 7 })
  @Type(() => Number)
  @IsInt()
  rentalId!: string;
}
