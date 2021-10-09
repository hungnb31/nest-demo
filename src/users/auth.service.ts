import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

import { UsersService } from './users.service';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async signup(email: string, password: string) {
    // check if email is in use
    const users = await this.usersService.find(email);
    if (users.length) {
      throw new BadRequestException('Email in use!');
    }

    // hash the users password
    // generate salt
    const salt = randomBytes(8).toString('hex');

    // hash salt and password together
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    // join the hashed password and the salt together
    const result = salt + '.' + hash.toString('hex');

    // create a new user and save it
    const user = await this.usersService.create(email, result);

    // return user
    return user;
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email);

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Wrong password!');
    }

    return user;
  }
}
