import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/models/user.entity';
import { Env } from './common/env';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: Env.DB_HOST,
      port: Env.DB_PORT,
      username: Env.DB_USERNAME,
      password: Env.DB_PASSWORD,
      database: Env.DB_DATABASE,
      entities: [User],
      synchronize: true,
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: './src/schema.gql',
      playground: true,
      debug: true
    }),
  ],
})
export class AppModule {}
