import { Module } from '@nestjs/common';
import { MailModule } from './mail';
import { AuthModule } from './auth';
import { ICryptoService } from '../services';
import { CryptoService } from './crypto.service';
import { PrismaService } from '../db-conection';

@Module({
  imports: [MailModule, AuthModule],
  providers: [
    PrismaService,
    {
      provide: ICryptoService,
      useClass: CryptoService,
    },
  ],
  exports: [MailModule, AuthModule, ICryptoService, PrismaService],
})
export class ProviderModule {}
