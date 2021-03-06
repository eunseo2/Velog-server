import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './passport/google.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'src/entities/user.repository';
import { MailerModule } from '@nestjs-modules/mailer';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import config from '../config';

import { NeedsAuthMiddleware } from 'src/middleware/needs-auth.middleware';
import { Token } from 'src/lib/token';
import { ConsumeTokenMiddleware } from 'src/middleware/consume-token.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository]),
    MailerModule.forRoot({
      transport: {
        service: 'Naver',
        host: 'smtp.naver.com',
        port: 587,
        auth: {
          user: config.EMAIL_ID, // generated ethereal user
          pass: config.EMAIL_PASS, // generated ethereal password
        },
      },

      template: {
        dir: process.cwd() + '/template/',
        adapter: new HandlebarsAdapter(), // or new PugAdapter()
        options: {
          strict: true,
        },
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, Token],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ConsumeTokenMiddleware).forRoutes(AuthController);
    consumer.apply(NeedsAuthMiddleware).forRoutes('/auth/logout');
  }
}
