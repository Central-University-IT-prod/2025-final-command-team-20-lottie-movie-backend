import { Module } from '@nestjs/common';
import { CacheModule } from '@/libs/Cache/CacheModule';
import { UserService } from '@/User/Service/UserService';
import { UserAuthService } from '@/User/Service/UserAuthService';
import { UserController } from '@/User/Controller/UserController';
import { PrismaModule } from '@/Prisma/PrismaModule';

@Module({
  imports: [PrismaModule, CacheModule],
  controllers: [UserController],
  providers: [UserService, UserAuthService],
  exports: [UserService, UserAuthService],
})
export class UserModule {}
