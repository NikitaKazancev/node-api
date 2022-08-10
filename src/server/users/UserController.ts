import { NextFunction, Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { ValidateMiddleware } from '../middlewares/ValidateMiddleware';
import HTTPError from '../errors/HTTPError';

import BaseController from '../common/BaseController';
import Components from '../types/Components';
import ILoggerService from '../services/logger/ILoggerService';
import UserLoginDto from './dto/UserLoginDto';
import UserRegisterDto from './dto/UserRegisterDto';
import IUserService from './IUserService';
import User from './User';
@injectable()
export default class UserController extends BaseController {
	constructor(
		@inject(Components.ILoggerService) logger: ILoggerService,
		@inject(Components.IUserService) private userService: IUserService
	) {
		super(logger);
	}

	public override exec(path: string): Router {
		const router = super.exec(path);

		this.bindRoutes([
			{ path: '/login', method: 'post', func: this.login },
			{
				path: '/register',
				method: 'post',
				func: this.register,
				middlewares: [new ValidateMiddleware(UserRegisterDto)],
			},
		]);

		return router;
	}

	login(
		{ body }: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: NextFunction
	): void {
		this.ok(res, 'login');
	}

	async register(
		{ body }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction
	): Promise<void> {
		const result = await this.userService.createUser(body);
		if (!result) return next(new HTTPError(422, 'Such user already exist'));
		this.ok(res, { email: result.email });
	}
}
