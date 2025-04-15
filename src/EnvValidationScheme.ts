import { IsNumber, Min, Max, IsString, IsNotEmpty, Matches, IsInt } from 'class-validator';
import { S3EnvValidationScheme } from '@/File/S3EnvValidationScheme';

export class EnvValidationScheme extends S3EnvValidationScheme {
  @IsString()
  @IsNotEmpty()
  @Matches(/^(development|production|test)$/, {
    message: 'NODE_ENV must be either development, production or test',
  })
  readonly NODE_ENV: string;

  @IsNumber()
  @Min(0)
  @Max(65535)
  readonly PORT: number;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9]+:[A-Za-z0-9_-]+(,[0-9]+:[A-Za-z0-9_-]+)*$/, {
    message: 'TELEGRAM_BOT_TOKEN must be a comma-separated list of valid Telegram bot tokens',
  })
  readonly TELEGRAM_BOT_TOKEN: string;

  @IsString()
  @IsNotEmpty()
  readonly RANDOM_SECRET: string;

  @IsString()
  @IsNotEmpty()
  readonly REDIS_HOST: string;

  @IsString()
  @IsNotEmpty()
  readonly REDIS_URL: string;

  @IsInt()
  @IsNotEmpty()
  readonly REDIS_PORT: number;

  @IsString()
  @IsNotEmpty()
  readonly OPENAI_API_KEY: string;

  @IsString()
  @IsNotEmpty()
  readonly OPENAI_PROXY: string;

  @IsString()
  @IsNotEmpty()
  readonly KINOPOISK_API: string;
}
