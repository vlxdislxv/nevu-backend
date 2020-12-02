import * as bcrypt from 'bcrypt';
import { Env } from '../env';

export class HashHelper {
  static async bcrypt(value: string): Promise<string> {
    return bcrypt.hash(value, Env.BCRYPT_SALT);
  }
}
