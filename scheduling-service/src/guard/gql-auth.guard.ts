import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthClient } from './auth.client.js';

interface GraphQLContext {
  req: {
    headers: Record<string, string | string[] | undefined>;
    user?: unknown;
  };
}

@Injectable()
export class GqlAuthGuard implements CanActivate {
  private readonly logger = new Logger(GqlAuthGuard.name);
  constructor(
    private readonly authClient: AuthClient
    ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlContext = GqlExecutionContext.create(context).getContext<GraphQLContext>();
    this.logger.log(`Incoming request headers: ${JSON.stringify(gqlContext.req.headers)}`);
    this.logger.log(`Incoming request user: ${JSON.stringify(gqlContext.req.user)}`);
    const authorization = gqlContext.req.headers.authorization;
    const token = this.getBearerToken(authorization);

    if (!token) {
      throw new UnauthorizedException('token is required');
    }

    gqlContext.req.user = await this.authClient.validateToken(token);
    return true;
  }

  private getBearerToken(authorization?: string | string[]): string | undefined {
    if (typeof authorization !== 'string') {
      return undefined;
    }

    const [scheme, token] = authorization.trim().split(/\s+/);
    return scheme?.toLowerCase() === 'bearer' && token ? token : undefined;
  }
}
