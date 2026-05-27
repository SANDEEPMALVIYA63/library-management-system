import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsInt,
  IsEnum,
  IsOptional,
  Min,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BOOKCATEGORY, LANGUAGETYPE } from 'src/generated/prisma/enums';

export class UpdateBookDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MinLength(1)
  title?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MinLength(1)
  author?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({})
  @IsOptional()
  @IsEnum(LANGUAGETYPE)
  language?: LANGUAGETYPE;

  @ApiProperty({
    enum: BOOKCATEGORY,
    required: false,
    example: BOOKCATEGORY.BIOGRAPHY,
  })
  @IsOptional()
  @IsEnum(BOOKCATEGORY)
  category?: BOOKCATEGORY;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  totalCopies?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  publishYear?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pages?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  edition?: string;
}
