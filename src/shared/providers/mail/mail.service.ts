import { BadRequestException, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { IMailService } from '../../services';
import { GLOBAL_CONFIG } from '../../configs';


@Injectable()
export class MailService implements IMailService {
  constructor(private readonly mailerService: MailerService) {}

  async send(
    email: string,
    name: string,
    token: string,
    body?: string,
  ): Promise<void> {
    const text = body
      ? body
      : 'Bem Vindo ao AuthService! clique no link abaixo para confirmar o seu email';

    try {
      const link = GLOBAL_CONFIG.frontendConfirmLink + token;
      const logo = GLOBAL_CONFIG.emailLogo;
      await this.mailerService.sendMail({
        to: email,
        from: "'Auth Service' authservice@gmail.com",
        subject: 'Bem Vindo ao AuthService',
        template: 'template',
        context: { link, name, token, logo, text },
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
