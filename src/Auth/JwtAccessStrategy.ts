import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

import { JwtPayload } from './Interfaces/JwtPayload';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { UserService } from '@/User/Service/UserService';
import { EnvValidationScheme } from '@/EnvValidationScheme';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'jwt-access') {
  private readonly logger = new Logger(JwtAccessStrategy.name);
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
    this.logger.debug(`validate: ${JSON.stringify(payload)}`);
    const maybeUser = await this.userService.find(payload.userId);
    if (!maybeUser) {
      throw new UnauthorizedException('NO_USER_FOUND');
    }
    return maybeUser;
  }
}
