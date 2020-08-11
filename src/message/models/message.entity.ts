import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../../user/models/user.entity';
import { Chat } from '../../chat/models/chat.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn()
  from: User;

  @ManyToOne(() => Chat)
  @JoinColumn()
  chat: Chat;

  @Column()
  text: string;
}
