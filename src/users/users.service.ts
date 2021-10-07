import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Users } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private readonly userRepo: Repository<Users>,
  ) {}

  create(email: string, password: string) {
    const user = this.userRepo.create({ email, password });

    return this.userRepo.save(user);
  }
}
