import {
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
  Column,
} from 'typeorm';
import { User } from '../../user/models/user.entity';
import { Message } from './message.entity';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => User)
  @JoinTable()
  users: User[];

  @OneToMany(() => Message, message => message.chat)
  @JoinColumn()
  messages: Message[];

  @Column()
  name: string;
}
