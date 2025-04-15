import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileService } from '@/File/Service/FileService';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileMetaDto } from '@/File/Service/Dto/FileMetaDto';
import { Response } from 'express';
import { ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { PrismaService } from '@/Prisma/PrismaService';

@Controller('/files')
export class FileController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileService: FileService,
  ) {}

  @ApiOperation({ summary: 'Upload file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post(':filmId')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fieldSize: 10000000000,
      },
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Param('filmId', ParseIntPipe) filmId: number,
  ): Promise<FileMetaDto> {
    const film = await this.prisma.film.findUnique({
      where: {
        id: filmId,
      },
    });

    if (!film) {
      throw new NotFoundException('Film not found');
    }

    const fileMeta = await this.fileService.uploadFile(file);

    await this.prisma.film.update({
      where: { id: filmId },
      data: {
        reelName: fileMeta.key,
      },
    });

    return fileMeta;
  }

  @Get(':key')
  async downloadFile(@Param('key') key: string, @Res() res: Response): Promise<void> {
    const stream = await this.fileService.getFileStream(key);
    res.setHeader('Content-Disposition', `attachment; filename="${key}"`);
    stream.pipe(res);
  }
}
