import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { CacheService } from '@/libs/Cache/CacheService';
import { UserJWTBody } from '@/User/Service/interface/UserJWTBody';
import { EnvValidationScheme } from '@/EnvValidationScheme';

const USER_ACCOUNT_TOKEN = 'USER_ACCOUNT';

@Injectable()
export class UserAuthService {
  private readonly jwtSecret: string;

  constructor(
    private readonly configService: ConfigService<EnvValidationScheme>,
    private readonly cacheService: CacheService,
  ) {
    this.jwtSecret = this.configService.get<string>('RANDOM_SECRET')!;
  }

  public async verifyJWTAndGetUserId(token: string): Promise<string> {
    const payload = jwt.verify(token, this.jwtSecret) as UserJWTBody;
    if (!payload) {
      throw new UnauthorizedException('Invalid JWT token.');
    }

    const userId = payload.userId;
    const currentJwtToken = await this.cacheService.get(`${USER_ACCOUNT_TOKEN}:${userId}`);
    if (currentJwtToken !== token) {
      throw new UnauthorizedException('JWT token expired.');
    }

    return userId;
  }
}
