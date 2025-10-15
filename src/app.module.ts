import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import {
	KimaAppModule,
	UserModule
} from './modules';
import { ProviderModule } from './shared';

@Module({
  imports: [UserModule, ProviderModule, KimaAppModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
