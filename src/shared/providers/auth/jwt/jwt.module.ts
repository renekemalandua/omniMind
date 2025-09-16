import { Module } from '@nestjs/common';
import {
  JwtModule as NestJwtModule,
  JwtService as NestJwtService,
} from '@nestjs/jwt';
import { IJwtService } from '../../../services';
import { JwtService } from './jwt.service';
import { GLOBAL_CONFIG } from '../../../configs';

@Module({
  imports: [
    NestJwtModule.register({
      secret: GLOBAL_CONFIG.jwtAuthSecret,
      signOptions: { expiresIn: GLOBAL_CONFIG.jwtAuthExp },
    }),
  ],
  providers: [
    NestJwtService,
    {
      provide: IJwtService,
      useClass: JwtService,
    },
  ],
  exports: [IJwtService, NestJwtService],
})
export class JwtModule {}
