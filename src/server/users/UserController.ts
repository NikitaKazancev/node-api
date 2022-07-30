import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import fs from 'fs';
import { resolve } from 'path';

import HTTPError from '../errors/HTTPError';
import BaseController from '../types/BaseController';
import Components from '../types/Components';
import ILoggerService from '../types/ILoggerService';
@injectable()
export default class UserController extends BaseController {
	constructor(@inject(Components.ILoggerService) logger: ILoggerService) {
		super(logger);
		this.bindRoutes([
			{ path: '/login', method: 'post', func: this.login },
			{ path: '/register', method: 'post', func: this.register },
		]);
	}

	login(req: Request, res: Response, next: NextFunction): void {
		// this.ok(res, 'login');
		next(new HTTPError(401, 'Unauthorized', 'unknown'));
	}

	register(req: Request, res: Response, next: NextFunction): void {
		this.ok(res, 'register');
	}
}
