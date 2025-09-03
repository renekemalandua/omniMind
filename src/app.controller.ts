import { Controller, Get, Res } from '@nestjs/common';
import type { Response } from 'express';
import { join } from 'path';

@Controller()
export class AppController {
  @Get()
  renderIndex(@Res() response: Response) {
    const htmlPath = join(process.cwd(), 'src', 'shared', 'templates', 'index.html');
    return response.sendFile(htmlPath);
  }
}
