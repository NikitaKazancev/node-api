import { NextFunction, Request, Response } from 'express';
import HTTPError from '../errors/HTTPError';
import IMiddleware from './IMiddleware';

export class AuthGuardMiddleware implements IMiddleware {
	execute(req: Request, res: Response, next: NextFunction): void {
		if (req.email) return next();
		next(new HTTPError(401, 'Вы не авторизованы', 'Unauthorized'));
	}
}
