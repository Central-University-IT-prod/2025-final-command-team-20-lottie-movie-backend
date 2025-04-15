import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class TokenPairResponseDto {
  @ApiProperty({ description: 'Access token' })
  @IsString()
  @IsNotEmpty()
  accessToken: string;

  static fromModel(accessToken: string): TokenPairResponseDto {
    const dto = new TokenPairResponseDto();
    dto.accessToken = accessToken;
    return dto;
  }
}
