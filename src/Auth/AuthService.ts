import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenPairResponseDto } from './Dto/TokenPairResponseDto';
import { JwtPayload } from './Interfaces/JwtPayload';
import { EnvValidationScheme } from '@/EnvValidationScheme';

@Injectable()
export class AuthService {
  private readonly jwtAccessSecret: string;
  private readonly jwtAccessExpiresIn: string = '999h';
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<EnvValidationScheme>,
  ) {
    this.jwtAccessSecret = this.configService.getOrThrow<string>('RANDOM_SECRET');
  }

  generateTokenPairByUserId(userId: string): TokenPairResponseDto {
    return TokenPairResponseDto.fromModel(this.generateAccessToken(userId));
  }

  private generateAccessToken(userId: string): string {
    return this.jwtService.sign(
      {
        userId: userId.toString(),
      } satisfies JwtPayload,
      { expiresIn: this.jwtAccessExpiresIn, secret: this.jwtAccessSecret },
    );
  }
}
