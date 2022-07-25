import { Request, Response } from 'express';

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

	login(req: Request, res: Response) {
		this.ok(res, 'login');
	}

	register(req: Request, res: Response) {
		this.ok(res, 'register');
	}
}
