import { Body, Controller, Post } from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
@Controller('auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/signup')
  createUser(@Body() body: CreateUserDto) {
    const { email, password } = body;
    this.usersService.create(email, password);
  }
}
