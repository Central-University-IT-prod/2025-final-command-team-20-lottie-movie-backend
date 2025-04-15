import { IsString, IsNotEmpty } from 'class-validator';

export class S3EnvValidationScheme {
  @IsString()
  @IsNotEmpty()
  readonly MINIO_URL: string;

  @IsString()
  @IsNotEmpty()
  readonly MINIO_ACCESS_KEY: string;

  @IsString()
  @IsNotEmpty()
  readonly MINIO_SECRET_KEY: string;

  @IsString()
  @IsNotEmpty()
  readonly MINIO_BUCKET_NAME: string;
}
