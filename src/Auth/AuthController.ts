import { BadRequestException, Body, Controller, Logger, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './AuthService';
import { LoginViaTelegramDto } from './Dto/LoginViaTelegramDto';
import { TelegramAuthUtilsService } from './TelegramAuthUtilsService';
import { UserService } from '@/User/Service/UserService';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly telegramAuthUtilsService: TelegramAuthUtilsService,
    private readonly userService: UserService,
  ) {}

  @Post('loginViaTelegram')
  @ApiOperation({ summary: 'Receive jwt tokens from Telegram init data' })
  @ApiResponse({
    status: 201,
    description: 'Tokens have generated successfully',
    type: 'string',
  })
  @ApiResponse({
    status: 400,
    description: 'Init data signature is invalid',
  })
  async getTokens(@Body() loginViaTelegramDto: LoginViaTelegramDto): Promise<string> {
    const initData = loginViaTelegramDto.rawInitData;
    if (!this.telegramAuthUtilsService.validateInitData(initData)) {
      throw new BadRequestException('Init data signature is invalid');
    }
    const parsedInitData = this.telegramAuthUtilsService.parseInitData(initData);
    this.logger.verbose('Parsed init data: ' + JSON.stringify(parsedInitData, null, 2));
    // Somehow even valid init data may not contain user id. In this case we should throw an error
    if (!parsedInitData.user?.id) {
      throw new BadRequestException('Init data signature is invalid');
    }
    const userId = parsedInitData.user.id.toString();
    await this.userService.upsert({
      id: userId,
      firstName: parsedInitData.user.first_name,
      lastName: parsedInitData.user.last_name,
      username: parsedInitData.user.username,
    });

    return this.authService.generateTokenPairByUserId(userId).accessToken;
  }
}
