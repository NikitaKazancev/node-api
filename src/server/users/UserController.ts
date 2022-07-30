import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { ValidateMiddleware } from '../middlewares/ValidateMiddleware';
import HTTPError from '../errors/HTTPError';

import BaseController from '../common/BaseController';
import Components from '../types/Components';
import ILoggerService from '../types/ILoggerService';
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
		this.bindRoutes([
			{ path: '/login', method: 'post', func: this.login },
			{
				path: '/register',
				method: 'post',
				func: this.register,
				middlewares: [new ValidateMiddleware(UserRegisterDto)],
			},
		]);
	}

	login({ body }: Request<{}, {}, UserLoginDto>, res: Response, next: NextFunction): void {
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
