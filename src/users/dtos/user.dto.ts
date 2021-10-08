import { Expose } from 'class-transformer';
// this dto describe the data we want to show to outside world
export class UserDto {
  @Expose()
  id: number;
  @Expose()
  email: string;
}
