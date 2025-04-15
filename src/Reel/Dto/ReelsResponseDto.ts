import { ReelResponseDto } from './ReelResponseDto';
import { ApiProperty } from '@nestjs/swagger';
export class ReelsResponseDto {
  @ApiProperty({ type: [ReelResponseDto] })
  reels: ReelResponseDto[];

  constructor(reels: ReelResponseDto[]) {
    this.reels = reels;
  }
}
