import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  Matches,
  // IsPhoneNumber,
} from 'class-validator';

export class AddMemberDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  firstname!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  lastname!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @ApiProperty()
  @IsNotEmpty()
  @Matches(/^[0-9]{10}$/, {
    message: 'Mobile number must be 10 digits',
  })
  mobile!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  address!: string;
}
