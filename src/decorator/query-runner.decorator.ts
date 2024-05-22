import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserModel } from '../entity/user-model.entity';

export const QueryRunner = createParamDecorator(
  (data: keyof UserModel | undefined, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();

    if (!req.queryRunner) {
      throw new InternalServerErrorException('QueryRunner가 없습니다.');
    }

    return req.queryRunner;
  },
);
