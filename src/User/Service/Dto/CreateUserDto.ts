import { IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  id: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
    required: false,
    nullable: true,
  })
  @IsString()
  @MinLength(1)
  firstName: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
    required: false,
    nullable: true,
  })
  @IsString()
  @MinLength(1)
  @IsOptional()
  lastName?: string;

  @ApiProperty({
    description: 'Username for the user',
    example: 'johndoe',
    required: false,
    nullable: true,
  })
  @IsString()
  @MinLength(1)
  @IsOptional()
  username?: string;
}
