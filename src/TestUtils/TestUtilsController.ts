import { Body, Controller, Logger, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../Auth/AuthService';
import { UserService } from '@/User/Service/UserService';
import { PrismaService } from '@/Prisma/PrismaService';
import { CreateUserDto } from '@/User/Service/Dto/CreateUserDto';

@ApiTags('Test Utils')
@Controller('test-utils')
export class TestUtilsController {
  private readonly logger = new Logger(TestUtilsController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly prisma: PrismaService,
  ) {}

  @ApiOperation({ summary: 'Receive jwt tokens by user id' })
  @ApiResponse({
    status: 201,
    description: 'Tokens have generated successfully',
    type: 'string',
  })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  @Post('login-bypass')
  async getTokens(@Body() body: CreateUserDto): Promise<string> {
    this.userService.upsert(body);
    return this.authService.generateTokenPairByUserId(body.id).accessToken;
  }

  @ApiOperation({ summary: 'Clear all database data (for testing purposes)' })
  @ApiResponse({
    description: 'Database has been cleared successfully',
  })
  @Post('cleanup')
  async cleanup() {
    const tableNames = await this.prisma.$queryRaw<
      Array<{ tableName: string }>
    >`SELECT tableName FROM pg_tables WHERE schemaname='public'`;

    const tables = tableNames
      .map(({ tableName }) => tableName)
      .filter((name) => name !== '_prisma_migrations')
      .map((name) => `"public"."${name}"`)
      .join(', ');

    try {
      this.logger.warn('CLEANING UP DATABASE');
      await this.prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`);
    } catch (error) {
      this.logger.error('Error cleaning up database', error);
    }

    return { message: 'Database cleared successfully' };
  }

  @ApiOperation({ summary: 'Set reel links for all films' })
  @Post('set-reel-links')
  async mockReels() {
    await this.prisma.film.updateMany({
      data: {
        reelName:
          'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      },
    });
  }

  @ApiOperation({ summary: 'Delete a half of the reels' })
  @Post('delete-half-of-reels')
  async deleteHalfOfReels() {
    const films = await this.prisma.film.findMany({
      where: {
        reelName: { not: null },
      },
    });

    const half = Math.floor(films.length / 2);
    await this.prisma.film.deleteMany({
      where: {
        id: { in: films.slice(0, half).map((film) => film.id) },
      },
    });
  }
}
