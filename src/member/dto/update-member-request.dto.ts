import {
  IsString,
  IsEmail,
  MinLength,
  Matches,
  // IsPhoneNumber,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMemberDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @MinLength(2)
  firstname?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MinLength(2)
  lastname?: string;

  @ApiProperty()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty()
  @IsOptional()
  @Matches(/^[0-9]{10}$/, {
    message: 'Mobile number must be 10 digits',
  })
  mobile?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  address?: string;
}
