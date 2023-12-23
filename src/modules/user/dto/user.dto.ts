import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UserDto {
  @ApiProperty({ example: 'string' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'string' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'string' })
  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  password: string;
}
