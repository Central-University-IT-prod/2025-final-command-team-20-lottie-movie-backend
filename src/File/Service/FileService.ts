import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { FileMetaDto } from '@/File/Service/Dto/FileMetaDto';
import { EnvValidationScheme } from '@/EnvValidationScheme';

@Injectable()
export class FileService {
  private readonly s3: AWS.S3;
  private readonly s3Url: string;
  private readonly bucketName: string;

  constructor(private readonly configService: ConfigService<EnvValidationScheme>) {
    this.s3Url = this.configService.getOrThrow('MINIO_URL');
    this.bucketName = this.configService.getOrThrow('MINIO_BUCKET_NAME');

    this.s3 = new AWS.S3({
      endpoint: this.s3Url,
      accessKeyId: this.configService.getOrThrow('MINIO_ACCESS_KEY'),
      secretAccessKey: this.configService.getOrThrow('MINIO_SECRET_KEY'),
      s3ForcePathStyle: true,
      signatureVersion: 'v4',
    });
  }

  public async uploadFile(file: Express.Multer.File): Promise<FileMetaDto> {
    if (!file) {
      throw new BadRequestException('No file uploaded.');
    }

    try {
      await this.s3.headBucket({ Bucket: this.bucketName }).promise();
    } catch {
      await this.s3.createBucket({ Bucket: this.bucketName }).promise();
    }

    const key = `${Date.now()}_${file.originalname}`.replaceAll(' ', '');
    try {
      await this.s3
        .upload({
          Bucket: this.bucketName,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        })
        .promise();
    } catch {
      throw new BadRequestException(`Unable to upload file: ${file.originalname}`);
    }

    return new FileMetaDto(key);
  }

  public async getFileStream(key: string) {
    await this.checkFileExistence(key);
    return this.s3.getObject({ Bucket: this.bucketName, Key: key }).createReadStream();
  }

  public async checkFileExistence(key: string): Promise<void> {
    try {
      await this.s3.headObject({ Bucket: this.bucketName, Key: key }).promise();
    } catch {
      throw new NotFoundException(`File with key ${key} does not exist.`);
    }
  }
}
