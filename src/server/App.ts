import express, { Express } from 'express';
import { Server } from 'http';
import { injectable, inject } from 'inversify';
import 'reflect-metadata';

import BaseController from './types/BaseController';
import Components from './types/Components';
import IErrorHandler from './types/IErrorHandler';
import ILoggerService from './types/ILoggerService';

@injectable()
export default class App {
	private app = express();
	private server: Server | undefined;
	private port = 8000;

	constructor(
		@inject(Components.ILoggerService) private logger: ILoggerService,
		@inject(Components.BaseController) private userController: BaseController,
		@inject(Components.IErrorHandler) private errorHandler: IErrorHandler
	) {}

	private useRoutes(): void {
		this.app.use('/users?', this.userController.router);
	}

	private useExceptionFilter(): void {
		this.app.use(this.errorHandler.catch.bind(this.errorHandler));
	}

	public init(): void {
		this.useRoutes();
		this.useExceptionFilter();
		this.server = this.app.listen(this.port);
		this.logger.log(`Server is running on http://localhost:${this.port}`);
	}
}
