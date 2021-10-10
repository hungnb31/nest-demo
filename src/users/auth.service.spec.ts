import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { Users } from './users.entity';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    // create a fake copy of user service
    const users: Users[] = [];
    // we just need to fake find and create method because we only use
    // those two methods in auth service
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          email,
          password,
        } as Users;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signup('abc@mail.com', '123123');

    expect(user.password).not.toEqual('123123');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    fakeUsersService.find = () =>
      Promise.resolve([
        { id: 1, email: 'abc@mail.com', password: '123123' } as Users,
      ]);

    try {
      await service.signup('abc@mail.com', '123123');
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.message).toEqual('Email in use!');
    }
  });

  it('throws if signin is called with not exist email', async () => {
    try {
      await service.signin('abc@mail.com', '123123');
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.message).toEqual('User not found!');
    }
  });

  it('throws if an invalid password is provided', async () => {
    fakeUsersService.find = () =>
      Promise.resolve([{ email: 'abc@mail.com', password: '123123' } as Users]);

    try {
      await service.signin('abc@mail.com', 'wrongpassword');
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.message).toEqual('Wrong password!');
    }
  });

  it('returns a user if correct password is provided', async () => {
    const email = 'abc@mail.com';
    const password = '123123';
    await service.signup(email, password);

    const user = await service.signin(email, password);
    expect(user).toBeDefined();
  });
});
