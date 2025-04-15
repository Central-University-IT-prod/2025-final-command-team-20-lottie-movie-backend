import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDefined, IsOptional, IsString } from 'class-validator';

export class CreateNoteViaTitleDto {
  @ApiProperty({
    example: 'My note',
    description: 'Title of the note',
  })
  @IsDefined()
  @IsString()
  title: string;

  @ApiPropertyOptional({
    example: 'This is my note',
    description: 'Description of the note',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
