import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserModule } from './modules';
import { ProviderModule } from './shared';

@Module({
  imports: [UserModule, ProviderModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
