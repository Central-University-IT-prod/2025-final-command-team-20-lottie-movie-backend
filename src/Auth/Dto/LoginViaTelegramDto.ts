import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginViaTelegramDto {
  @ApiProperty({ description: 'Raw Telegram init data' })
  @IsString()
  @IsNotEmpty()
  rawInitData: string;

  constructor(rawInitData: string) {
    this.rawInitData = rawInitData;
  }
}
