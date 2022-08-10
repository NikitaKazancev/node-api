import express, { Express } from 'express';
import { Server } from 'http';
import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import { json } from 'body-parser';

import BaseController from './common/BaseController';
import Components from './types/Components';
import IErrorHandler from './errors/IErrorHandler';
import ILoggerService from './services/logger/ILoggerService';
import { PrismaService } from './database/PrismaService';

@injectable()
export default class App {
	private app = express();
	private server: Server | undefined;
	private port = 8000;

	constructor(
		@inject(Components.ILoggerService) private logger: ILoggerService,
		@inject(Components.BaseController) private userController: BaseController,
		@inject(Components.IErrorHandler) private errorHandler: IErrorHandler,
		@inject(Components.PrismaService) private prismaService: PrismaService
	) {}

	private useMiddleware(): void {
		this.app.use(json());
	}

	private useRoutes(): void {
		const usersPath = '/users?';
		this.app.use(usersPath, this.userController.exec(usersPath));
	}

	private useExceptionFilter(): void {
		this.app.use(this.errorHandler.catch.bind(this.errorHandler));
	}

	public async init(): Promise<void> {
		this.useMiddleware();
		this.useRoutes();
		this.useExceptionFilter();
		await this.prismaService.connect();
		this.server = this.app.listen(this.port);
		this.logger.log(`Server is running on http://localhost:${this.port}`);
	}
}
