import { Module } from '@nestjs/common';
import { TestUtilsController } from './TestUtilsController';
import { PrismaModule } from '@/Prisma/PrismaModule';
import { AuthModule } from '@/Auth/AuthModule';
import { UserModule } from '@/User/UserModule';

@Module({
  imports: [PrismaModule, AuthModule, UserModule],
  controllers: [TestUtilsController],
})
export class TestUtilsModule {}
