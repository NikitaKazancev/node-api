import express from 'express';
import { type Server } from 'http';
import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import { json } from 'body-parser';

import type BaseController from './common/BaseController';
import Components from './types/Components';
import type IErrorHandler from './errors/IErrorHandler';
import type ILoggerService from './services/logger/ILoggerService';
import { type PrismaService } from './database/PrismaService';
import { AuthMiddleware } from './middlewares/AuthMiddleware';
import { type IConfigService } from './services/config/IConfigService';
import { ENV } from './services/config/ENV';

@injectable()
export default class App {
	public app = express();
	private server: Server | undefined;
	private port = 8000;

	constructor(
		@inject(Components.ILoggerService) private logger: ILoggerService,
		@inject(Components.BaseController) private userController: BaseController,
		@inject(Components.IErrorHandler) private errorHandler: IErrorHandler,
		@inject(Components.PrismaService) private prismaService: PrismaService,
		@inject(Components.IConfigService) private configService: IConfigService
	) {}

	private useMiddleware(): void {
		this.app.use(json());
		const authMiddleware = new AuthMiddleware(
			this.configService.get(ENV.SECRET)
		);
		this.app.use(authMiddleware.execute.bind(authMiddleware));
	}

	private useRoutes(): void {
		const usersPath = '/users?';
		this.app.use(usersPath, this.userController.exec(usersPath));
	}

	private useErrorHandler(): void {
		this.app.use(this.errorHandler.catch.bind(this.errorHandler));
	}

	public async init(): Promise<void> {
		this.useMiddleware();
		this.useRoutes();
		this.useErrorHandler();
		await this.prismaService.connect();
		this.server = this.app.listen(this.port);
		this.logger.log(`Server is running on http://localhost:${this.port}`);
	}

	public finish(): void {
		this.server?.close();
	}
}
