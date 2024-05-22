import { QueryRunner, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserPasswordAuth } from '../entity/user-password-auth.entity';
import { BaseRepository } from './base.repository';

export class UserPasswordAuthRepository extends BaseRepository<UserPasswordAuth> {
  constructor(
    @InjectRepository(UserPasswordAuth)
    private userPasswordAuthRepository: Repository<UserPasswordAuth>,
  ) {
    super(userPasswordAuthRepository, UserPasswordAuth);
  }

  async create(data: UserPasswordAuth, queryRunner?: QueryRunner) {
    await this.getRepository(queryRunner).save(data);
  }
}
