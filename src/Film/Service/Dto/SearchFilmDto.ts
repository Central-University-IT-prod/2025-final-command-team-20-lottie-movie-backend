import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchFilmDto {
  @IsString()
  @MinLength(1)
  @ApiProperty()
  value: string;
}
