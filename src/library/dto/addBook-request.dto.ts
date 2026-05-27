import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsEnum,
  IsOptional,
  Min,
  Length,
} from 'class-validator';
import { Type } from 'class-transformer';
import { LANGUAGETYPE, BOOKCATEGORY } from 'src/generated/prisma/enums';

export class AddBookDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(3, 100)
  title!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(3, 100)
  author!: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Length(3, 300)
  description?: string;

  @ApiProperty({ enum: LANGUAGETYPE })
  @IsNotEmpty()
  @IsEnum(LANGUAGETYPE)
  language!: LANGUAGETYPE;

  @ApiProperty({ enum: BOOKCATEGORY })
  @IsNotEmpty()
  @IsEnum(BOOKCATEGORY)
  category!: BOOKCATEGORY;

  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  totalCopies!: number;

  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  availableCopies!: number;

  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  publishYear?: number;

  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  pages?: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  edition?: string;
}
