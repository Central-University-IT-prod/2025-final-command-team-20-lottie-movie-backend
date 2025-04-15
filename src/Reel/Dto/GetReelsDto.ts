import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Max } from 'class-validator';

export class GetReelsDto {
  @ApiProperty({
    description: 'The number of reels to get',
    type: 'number',
    required: false,
  })
  @IsNumber()
  @Max(25)
  @IsOptional()
  limit?: number | null;

  @ApiProperty({
    description: 'The number of reels to skip',
    type: 'number',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  startFromId?: number | null;

  constructor(limit?: number | null, startFromId?: number | null) {
    this.limit = limit;
    this.startFromId = startFromId;
  }
}
