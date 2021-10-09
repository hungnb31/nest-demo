import { Injectable, NotFoundException } from '@nestjs/common';
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

  findOne(id: number) {
    if (!id) return null;
    return this.userRepo.findOne(id);
  }

  find(email: string) {
    return this.userRepo.find({ email });
  }

  async update(id: number, attrs: Partial<Users>) {
    // find user we need to update
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    // create updated user object
    Object.assign(user, attrs);

    // save updated user to db
    return this.userRepo.save(user);
  }

  async remove(id: number) {
    // we have two method to remove record
    // first one is remove, this one work with entity. i.e. remove(users)
    // second one is delete, this work with just id. i.e. delete(userId)

    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    return this.userRepo.remove(user);
  }
}
