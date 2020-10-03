import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, BeforeInsert } from 'typeorm';
import { Chat } from '../../chat/models/chat.entity';
import { BaseEntity } from '../../common/base/base-entity';
import { HashHelper } from '../../common/helpers/hash.helper';

@Entity()
export class User extends BaseEntity<User> {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => Chat)
  @JoinTable({ name: 'user_chats_chat' })
  chats: Chat[];

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  fullName: string;

  @BeforeInsert()
  async beforeInsert(): Promise<void> {
    this.password = await HashHelper.bcrypt(this.password);
  }
}
