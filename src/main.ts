import { NestFactory } from '@nestjs/core';
import { AppModule } from './AppModule';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger';
import { SwaggerTheme } from 'swagger-themes';
import { SwaggerThemeNameEnum } from 'swagger-themes';
import { EnvValidationScheme } from './EnvValidationScheme';
import { initFilms } from './Utils/InitFilms';
import { PrismaService } from './Prisma/PrismaService';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService<EnvValidationScheme>);

  app.setGlobalPrefix('/api');

  const config = new DocumentBuilder()
    .setTitle('banana')
    .setDescription('banana')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'jwt-access',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document, {
    customCss: new SwaggerTheme().getBuffer(SwaggerThemeNameEnum.DARK_MONOKAI),
  });

  app.use('/openapi.json', (req: Request, res: Response) => {
    // @ts-expect-error kys
    res.json(document);
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      errorHttpStatusCode: 422,
    }),
  );

  app.enableCors({
    origin: '*',
    methods: '*',
    credentials: true,
  });

  console.log('Inserting films...');
  const prisma = app.get(PrismaService);
  await initFilms(prisma);
  console.log('Films inserted');
  await app.listen(configService.getOrThrow<number>('PORT'), '0.0.0.0');
}
bootstrap();
