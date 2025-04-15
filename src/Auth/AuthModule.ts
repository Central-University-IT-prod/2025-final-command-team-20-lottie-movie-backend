import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './AuthController';
import { AuthService } from './AuthService';
import { JwtAccessStrategy } from './JwtAccessStrategy';
import { JwtRefreshStrategy } from './JwtRefreshStrategy';
import { TelegramAuthUtilsService } from './TelegramAuthUtilsService';
import { UserModule } from '@/User/UserModule';

@Module({
  imports: [PassportModule.register({}), JwtModule.register({}), UserModule],
  providers: [AuthService, JwtAccessStrategy, JwtRefreshStrategy, TelegramAuthUtilsService],
  controllers: [AuthController],
  exports: [AuthService, JwtAccessStrategy, JwtRefreshStrategy],
})
export class AuthModule {}
