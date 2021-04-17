import { User } from '../../user/core/db/user.entity';

export interface ISubContext {
  req: {
    user: User;
  };
}
