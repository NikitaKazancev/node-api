import { NextFunction, Request, Response } from 'express';
import HTTPError from '../server/errors/HTTPError.js';

import BaseController from '../server/types/BaseController.js';
import ILoggerService from '../server/types/ILoggerService.js';

export default class UserController extends BaseController {
	constructor(logger: ILoggerService) {
		super(logger);
		this.bindRoutes([
			{ path: '/login', method: 'post', func: this.login },
			{ path: '/register', method: 'post', func: this.register },
		]);
	}

	login(req: Request, res: Response, next: NextFunction) {
		// this.ok(res, 'login');
		next(new HTTPError(401, 'Unauthorized'));
	}

	register(req: Request, res: Response, next: NextFunction) {
		this.ok(res, 'register');
	}
}
