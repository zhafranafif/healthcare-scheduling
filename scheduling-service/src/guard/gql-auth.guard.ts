import {
  CanActivate,
  ExecutionContext,
  Injectable,
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
  constructor(
    private readonly authClient: AuthClient
    ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlContext = GqlExecutionContext.create(context).getContext<GraphQLContext>();
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
