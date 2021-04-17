import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../user/core/db/user.repository';

@ValidatorConstraint({ async: true })
@Injectable()
export class EmailUnique implements ValidatorConstraintInterface {
  constructor(protected readonly userRepository: UserRepository) {}

  public async validate(text: string): Promise<boolean> {
    const user = await this.userRepository.findByEmail(text);

    return !user;
  }

  public defaultMessage(): string {
    return 'This e-mail is already registered.';
  }
}
