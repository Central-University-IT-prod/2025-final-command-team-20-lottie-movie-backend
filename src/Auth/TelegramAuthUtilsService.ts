import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { EnvValidationScheme } from '@/EnvValidationScheme';
import { TelegramInitDataDto } from './Dto/TelegramInitDataDto';

@Injectable()
export class TelegramAuthUtilsService {
  private readonly botTokens: string[];

  constructor(private readonly configService: ConfigService<EnvValidationScheme>) {
    this.botTokens = this.configService.getOrThrow<string>('TELEGRAM_BOT_TOKEN').split(',');
  }

  parseInitData(rawInitData: string): TelegramInitDataDto {
    const firstLayerInitData = Object.fromEntries(new URLSearchParams(rawInitData));

    const initData: any = {};

    for (const key in firstLayerInitData) {
      try {
        initData[key] = JSON.parse(firstLayerInitData[key]);
      } catch {
        initData[key] = firstLayerInitData[key];
      }
    }
    return initData as TelegramInitDataDto;
  }

  validateInitData(rawInitData: string): boolean {
    const initData = new URLSearchParams(rawInitData);
    initData.sort();
    const hash = initData.get('hash');
    initData.delete('hash');

    const dataToCheck = [...initData.entries()].map(([key, value]) => key + '=' + value).join('\n');

    return this.botTokens.some((token) => {
      const secretKey = crypto.createHmac('sha256', 'WebAppData').update(token).digest();
      const _hash = crypto.createHmac('sha256', secretKey).update(dataToCheck).digest('hex');
      return hash === _hash;
    });
  }
}
