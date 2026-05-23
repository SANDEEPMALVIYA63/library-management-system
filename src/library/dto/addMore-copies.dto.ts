import { IsNumber, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddMoreCopies {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  additionalCopies!: number;
}
