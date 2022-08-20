import { NextFunction, Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { ValidateMiddleware } from '../middlewares/ValidateMiddleware';
import HTTPError from '../errors/HTTPError';
import { sign } from 'jsonwebtoken';

import BaseController from '../common/BaseController';
import Components from '../types/Components';
import ILoggerService from '../services/logger/ILoggerService';
import UserLoginDto from './dto/UserLoginDto';
import UserRegisterDto from './dto/UserRegisterDto';
import IUserService, { IGetUserResponse } from './IUserService';
import { IConfigService } from '../services/config/IConfigService';
import { ENV } from '../services/config/ENV';
import { AuthGuardMiddleware } from '../middlewares/AuthGuardMiddleware';
@injectable()
export default class UserController extends BaseController {
	private secret: string;

	constructor(
		@inject(Components.ILoggerService) logger: ILoggerService,
		@inject(Components.IUserService) private userService: IUserService,
		@inject(Components.IConfigService) configService: IConfigService
	) {
		super(logger);
		logger.log('[User] Controller has been ran');
		this.secret = configService.get(ENV.SECRET);
	}

	public override exec(path: string): Router {
		const router = super.exec(path);

		this.bindRoutes([
			{
				path: '/login',
				method: 'post',
				func: this.login,
				middlewares: [new ValidateMiddleware(UserLoginDto)],
			},
			{
				path: '/delete',
				method: 'post',
				func: this.delete,
				middlewares: [new ValidateMiddleware(UserLoginDto)],
			},
			{
				path: '/register',
				method: 'post',
				func: this.register,
				middlewares: [new ValidateMiddleware(UserRegisterDto)],
			},
			{
				path: '/info',
				method: 'get',
				func: this.info,
				middlewares: [new AuthGuardMiddleware()],
			},
		]);

		return router;
	}

	private async login(
		{ body }: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: NextFunction
	): Promise<void> {
		const response: IGetUserResponse = await this.userService.getUser(body);

		switch (response.type) {
			case 'incorrect-email':
				return next(
					new HTTPError(422, 'Such user does not exist', 'login')
				);
			case 'incorrect-password':
				return next(new HTTPError(401, 'Unauthorized', 'login'));
		}

		const jwt = await this.signJWT(body.email, this.secret);
		this.ok(res, { data: { jwt }, message: 'User has been logged' });
	}

	private async register(
		{ body }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction
	): Promise<void> {
		const result = await this.userService.createUser(body);
		if (!result)
			return next(new HTTPError(422, 'Such user already exist', 'register'));
		this.ok(res, {
			data: { email: result.email, id: result.id },
			message: 'User has been registered',
		});
	}

	private async delete(
		{ body }: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: NextFunction
	): Promise<void> {
		const deleted = await this.userService.deleteUser(body);
		if (!deleted)
			return next(new HTTPError(422, 'Such user does not exist', 'delete'));

		this.ok(res, { message: 'User has been deleted' });
	}

	private async info(
		{ email }: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		const id = await this.userService.getUserId(email);
		if (id > -1) this.ok(res, { data: { id, email } });
	}

	private signJWT(email: string, secret: string): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			sign(
				{
					email,
					iat: Math.floor(Date.now() / 1000),
				},
				secret,
				{
					algorithm: 'HS256',
				},
				(error, token) => {
					if (error) reject(error);
					else resolve(token as string);
				}
			);
		});
	}
}
