import {inject} from '@loopback/context';
import {Next, Provider} from '@loopback/core';
import {Middleware, MiddlewareContext, Request, Response} from '@loopback/rest';
import {HttpErrors} from '@loopback/rest';
import jwt from 'jsonwebtoken';

export class AuthenticationMiddlewareProvider implements Provider<Middleware> {
  constructor(
    @inject('app.httpContext') protected httpContext: MiddlewareContext,
  ) {}

  value(): Middleware {
    return async (ctx, next) => {
      await this.authenticate(ctx.request, ctx.response, next);
    };
  }

  async authenticate(request: Request, response: Response, next: Next) {
    const token = request.headers.authorization?.split(' ')[1] as string;
    if (!token) {
      throw new HttpErrors.Unauthorized('Unauthorized: No token provided');
    }
    const decoded = jwt.decode(token) as {
      email: string;
      canonicalName: string;
      roles: string[];
      username: string;
    };
    if (!decoded) {
      throw new HttpErrors.Unauthorized('Unauthorized: Invalid token');
    }
    // Store the decoded token in the request context for further processing
    this.httpContext.bind('decodedToken').to(decoded);

    // Call the next middleware or controller
    await next();
  }
}
