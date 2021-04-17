import { Injectable } from '@nestjs/common';
import { GqlModuleOptions, GqlOptionsFactory } from '@nestjs/graphql';
import { SubscriptionService } from '../../subscription.service';

@Injectable()
export class GqlConfig implements GqlOptionsFactory {
  constructor(private readonly subService: SubscriptionService) {}

  public createGqlOptions(): GqlModuleOptions {
    return {
      autoSchemaFile: 'schema.gql',
      playground: true,
      debug: true,
      installSubscriptionHandlers: true,
      context: ({ req, connection }) =>
        connection ? { req: connection.context } : { req },
      subscriptions: {
        onConnect: async (...args) =>
          await this.subService.onConnect(args[0], args[1]),
        onDisconnect: async (...args) =>
          await this.subService.onDisconnect(args[0]),
      },
    };
  }
}
