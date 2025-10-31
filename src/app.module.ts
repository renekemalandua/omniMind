import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import {
	KimaAppModule,
	UserModule,
	LarAngolaModule,
} from './modules';
import { ProviderModule } from './shared';

@Module({
	imports: [UserModule, ProviderModule, KimaAppModule, LarAngolaModule],
	controllers: [AppController],
	providers: [],
})
export class AppModule { }
