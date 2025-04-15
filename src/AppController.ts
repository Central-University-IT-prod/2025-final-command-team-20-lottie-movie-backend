import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor() {}

  @Get('/ping')
  async ping(@Res() res: Response): Promise<void> {
    res.send('pong');
  }
}
