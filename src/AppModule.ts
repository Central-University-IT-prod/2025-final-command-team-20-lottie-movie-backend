import { Module } from '@nestjs/common';
import { AppController } from './AppController';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from '@/User/UserModule';
import { validate } from './Utils/ValidateEnv';
import { EnvValidationScheme } from './EnvValidationScheme';
import { AuthModule } from './Auth/AuthModule';
import { TestUtilsModule } from './TestUtils/TestUtilsModule';
import { NotesModule } from './Notes/NoteModule';
import { ReelModule } from './Reel/ReelModule';
import { FilmModule } from '@/Film/FilmModule';
import { FileModule } from '@/File/FileModule';
import { MatchModule } from './Match/MatchModule';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      validate: validate(EnvValidationScheme),
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService<EnvValidationScheme>) => ({
        redis: {
          host: configService.get<string>('REDIS_HOST', 'localhost'),
          port: configService.get<number>('REDIS_PORT', 6379),
        },
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    ...(process.env.NODE_ENV === 'production' ? [] : [TestUtilsModule]),
    UserModule,
    ReelModule,
    NotesModule,
    FilmModule,
    FileModule,
    MatchModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
