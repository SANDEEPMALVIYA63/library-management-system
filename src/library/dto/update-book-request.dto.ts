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
import { LanguageType, BookCategory } from 'src/generated/prisma/enums';

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
  @IsEnum(LanguageType)
  language?: LanguageType;

  @ApiProperty({
    enum: BookCategory,
    required: false,
    example: BookCategory.BIOGRAPHY,
  })
  @IsOptional()
  @IsEnum(BookCategory)
  category?: BookCategory;

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
