import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'adb@email.com',
    description: '이메일 주소',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public readonly email: string;

  @ApiProperty({
    example: '123123',
    description: '비밀번호',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public readonly password: string;

  @ApiProperty({
    example: '삼식이',
    description: '이름',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public readonly name: string;
}
