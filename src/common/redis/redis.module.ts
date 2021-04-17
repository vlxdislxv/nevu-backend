import { Global, Module } from '@nestjs/common';
import providers from './providers';

@Global()
@Module({
  providers: [...providers],
  exports: [...providers],
})
export class RedisModule {}
