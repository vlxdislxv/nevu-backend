import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ConfigService } from 'src/config/config.service';

@Injectable()
export class HashHelper {
  constructor(private readonly configService: ConfigService) {}

  public bcrypt(value: string): Promise<string> {
    return bcrypt.hash(value, this.configService.get('BCRYPT_SALT'));
  }
}
