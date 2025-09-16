import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { join } from 'path';
import { IMailService } from '../../services';
import { GLOBAL_CONFIG } from '../../configs';


@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: GLOBAL_CONFIG.smtpHost,
        port: GLOBAL_CONFIG.smtpPort,
        secure: false,
        auth: {
          user: GLOBAL_CONFIG.smtpUser,
          pass: GLOBAL_CONFIG.smtpPass,
        },
      },
      template: {
        dir: join(process.cwd(), 'src/shared/templates/view'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [
    MailService,
    {
      provide: IMailService,
      useClass: MailService,
    },
  ],
  exports: [IMailService],
})
export class MailModule {}
