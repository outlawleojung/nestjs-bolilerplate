import { Controller, HttpStatus, Post, Headers, UseGuards, UseInterceptors, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RefreshTokenGuard } from './guard/bearer-token.guard';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BasicTokenGuard } from './guard/basic-token.guard';
import { QueryRunner } from '../decorator/query-runner.decorator';
import { TransactionInterceptor } from '../interceptor/transaction.interceptor';
import { QueryRunner as QR } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import { AuthEmailDto } from './dto/auth-email.dto';
import { ConfirmEmailDto } from './dto/confrim-email.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 액세스 토큰 재발급
   * @param rawToken
   * @returns accessToken
   */

  @ApiOperation({ summary: '액세스 토큰 재발급 받기' })
  @Post('token/access')
  @UseGuards(RefreshTokenGuard)
  async createTokenAccess(@Headers('authorization') rawToken: string) {
    console.log('token : ', rawToken);
    const token = this.authService.extractTokenFromHeader(rawToken, true);

    const accessToken = await this.authService.rotateToken(token, false);

    return { accessToken };
  }

  /**
   * 리프레쉬 토큰 재발급
   * @param rawToken
   * @returns refreshToken
   */

  @ApiOperation({ summary: '리프레시 토큰 재발급 받기' })
  @Post('token/refresh')
  @UseGuards(RefreshTokenGuard)
  async createTokenRefresh(@Headers('authorization') rawToken: string) {
    const token = this.authService.extractTokenFromHeader(rawToken, true);

    const refreshToken = await this.authService.rotateToken(token, true);

    await this.authService.saveRefreshToken(refreshToken);

    return { refreshToken };
  }

  /**
   * 이메일로 로그인 하기
   * @param rawToken
   * @returns { accessToken, refreshToken}
   */

  @ApiOperation({ summary: '이메일 로그인' })
  @Post('login/email')
  @UseGuards(BasicTokenGuard)
  async loginEmail(@Headers('authorization') rawToken: string) {
    const token = this.authService.extractTokenFromHeader(rawToken, false);
    const credentials = this.authService.decodeBasicToken(token);

    return await this.authService.loginWithEmail(credentials);
  }

  /**
   * 이메일로 회원 가입 하기
   * @param email
   * @param password
   * @param regPathType
   * @returns { accessToken, refreshToken}
   */


  @ApiOperation({ summary: '회원 가입' })
  @UseInterceptors(TransactionInterceptor)
  @Post('register/email')
  async registerEmail(
    @QueryRunner() queryRunner: QR,
    @Body() data: RegisterDto,
  ) {
    return await this.authService.registerWithEmail(
      {
        email: data.email,
        password: data.password,
        name: data.name,
      },
      queryRunner,
    );
  }

  /**
   * 자동 로그인
   * @param rawToken
   * @returns
   */

  @ApiOperation({ summary: '자동 로그인' })
  @UseGuards(RefreshTokenGuard)
  @Post('login/autoLogin')
  async autoLogin(@Headers('authorization') rawToken: string) {
    const token = this.authService.extractTokenFromHeader(rawToken, true);
    return await this.authService.autoLogin(token);
  }

  /**
   * 이메일 인증 번호 받기
   * @param queryRunner
   * @param autoEmailDto
   * @returns AuthEmailResponseDto
   */

  @ApiOperation({ summary: '이메일 인증번호 받기' })
  @UseInterceptors(TransactionInterceptor)
  @Post('authEmail')
  async authEmail(
    @Body() autoEmailDto: AuthEmailDto,
    @QueryRunner() queryRunner: QR,
  ) {
    return await this.authService.authEmail(autoEmailDto, queryRunner);
  }

  /**
   * 이메일 인증 확인 받기
   * @param queryRunner
   * @param confirmEmailDto
   * @returns
   */

  @ApiOperation({ summary: '이메일 인증 확인' })
  @UseInterceptors(TransactionInterceptor)
  @Post('confirmEmail')
  async confirmEmail(
    @QueryRunner() queryRunner: QR,
    @Body() confirmEmailDto: ConfirmEmailDto,
  ) {
    return await this.authService.confirmEmail(confirmEmailDto, queryRunner);
  }

  /**
   * 패스워드 재설정
   * @param queryRunner
   * @param resetPasswordDto
   * @returns
   */

  @ApiOperation({ summary: '패스워드 재설정' })
  @UseInterceptors(TransactionInterceptor)
  @Post('resetPassword')
  async resetPassword(
    @QueryRunner() queryRunner: QR,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    return await this.authService.resetPassword(
      resetPasswordDto,
      queryRunner,
    );
  }
}
