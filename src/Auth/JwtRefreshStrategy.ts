import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

import { JwtPayload } from './Interfaces/JwtPayload';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { UserService } from '@/User/Service/UserService';
import { EnvValidationScheme } from '@/EnvValidationScheme';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private readonly configService: ConfigService<EnvValidationScheme>,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('RANDOM_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const maybeUser = await this.userService.find(payload.userId);
    if (!maybeUser) {
      throw new UnauthorizedException('NO_USER_FOUND');
    }
    return maybeUser;
  }
}
