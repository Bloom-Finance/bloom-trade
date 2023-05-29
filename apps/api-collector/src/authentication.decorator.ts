import {inject, Context} from '@loopback/context';
import {Middleware, Request, Response} from '@loopback/rest';
import {HttpErrors} from '@loopback/rest';
import jwt from 'jsonwebtoken';

export function authenticate(): MethodDecorator {
  return function (
    target: Object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (this: any, ...args: any[]) {
      const middleware = async (
        req: Request,
        res: Response,
        next: () => Promise<void>,
      ) => {
        const token = req.headers.authorization?.split(' ')[1] as string;
        if (!token) {
          throw new HttpErrors.Unauthorized('Unauthorized: No token provided');
        }
        const decoded = jwt.decode(token);
        if (!decoded) {
          throw new HttpErrors.Unauthorized('Unauthorized: Invalid token');
        }
        // Store the decoded token in the request context for further processing
        const ctx: Context = this.ctx;
        ctx.bind('decodedToken').to(decoded);

        // Call the next middleware or controller
        await next();
      };

      const boundDescriptor = Object.assign({}, descriptor, {
        value: middleware,
      });

      return boundDescriptor.value.apply(this, args);
    };

    return descriptor;
  };
}
