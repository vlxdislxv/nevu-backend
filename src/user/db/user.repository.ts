import { Connection, EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  public findById(id: number): Promise<User | undefined> {
    return this.findOne({ id });
  }

  public search(search: string, selfId: number): Promise<User[]> {
    return this.createQueryBuilder('user')
      .where('user.fullName LIKE :fullName and id != :uid', {
        fullName: `%${search}%`,
        uid: selfId,
      })
      .getMany();
  }

  public findByEmail(email: string): Promise<User | undefined> {
    return this.findOne({ email });
  }

  public findByUsername(username: string): Promise<User | undefined> {
    return this.findOne({ username });
  }
}

export const UserRepositoryProvider = {
  provide: 'UserRepository',
  useFactory: (connection: Connection): UserRepository =>
    connection.getCustomRepository(UserRepository),
  inject: [Connection],
};
