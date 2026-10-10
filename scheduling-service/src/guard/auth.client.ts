import { Injectable, UnauthorizedException } from '@nestjs/common';

interface AuthUser {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

interface ValidateTokenResponse {
  data?: {
    validateToken?: AuthUser;
  };
  errors?: Array<{ message: string }>;
}

@Injectable()
export class AuthClient {
  private readonly authServiceUrl = process.env.AUTH_SERVICE_URL ?? 'http://localhost:3001/graphql';

  async validateToken(token: string): Promise<AuthUser> {
    const response = await fetch(this.authServiceUrl, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query ValidateToken($token: String!) {
            validateToken(token: $token) {
              id
              email
              createdAt
              updatedAt
            }
          }
        `,
        variables: { token },
      }),
    });

    let body: ValidateTokenResponse;
    try {
      body = (await response.json()) as ValidateTokenResponse;
    } catch {
      throw new UnauthorizedException('Auth service returned an invalid response');
    }

    const user = body.data?.validateToken;
    if (!response.ok || body.errors?.length || !user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    return user;
  }
}

export type { AuthUser };
