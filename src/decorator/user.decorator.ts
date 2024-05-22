import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserModel } from '../entity/user-model.entity';

export const User = createParamDecorator(
  (data: keyof UserModel | undefined, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();

    const user = req.user as UserModel;

    if (!user) {
      throw new InternalServerErrorException();
    }

    return data ? user[data] : user;
  },
);
