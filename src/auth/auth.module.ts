import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModel } from '../entity/user-model.entity';
import { EmailConfirm } from '../entity/email-confirm.entity';
import { EmailVerification } from '../entity/email-verification.entity';
import { UserPasswordAuth } from '../entity/user-password-auth.entity';
import { UserRepository } from '../repository/user.repository';
import { UserPasswordAuthRepository } from '../repository/member-password-auth.repository';
import { EmailVerificationRepository } from '../repository/email-verification.repository';
import { EmailConfirmRepository } from '../repository/email-confirm.repository';
import { MailService } from '../mail/mail.service';
import { JwtService } from '@nestjs/jwt';
import { MailModule } from '../mail/mail.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([
      UserModel,
      EmailConfirm,
      EmailVerification,
      UserPasswordAuth,
    ]),
    MailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtService, UserRepository, UserPasswordAuthRepository,
    EmailVerificationRepository, EmailConfirmRepository],
})
export class AuthModule {}
