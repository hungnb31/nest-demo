import {
  AfterInsert,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterUpdate,
  AfterRemove,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @AfterInsert()
  logInsert() {
    console.log('Inserting an user with id: ', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Updating an user with id: ', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('Removing an user with id: ', this.id);
  }
}

// NOTE:
// Those hooks above can only execute when we create an instance
// instead of passing object directly to method
