import express, { Express } from 'express';
import { Server } from 'http';
import UserController from '../users/UserController.js';
import IErrorHandler from './types/IErrorHandler.js';
import ILoggerService from './types/ILoggerService.js';

export default class App {
	private app: Express = express();
	private server: Server | undefined;
	private port = 8000;

	constructor(
		private logger: ILoggerService,
		private userController: UserController,
		private errorHandler: IErrorHandler
	) {}

	private useRoutes() {
		this.app.use('/users?', this.userController.router);
	}

	private useExceptionFilter() {
		this.app.use(this.errorHandler.catch.bind(this.errorHandler));
	}

	public init() {
		this.useRoutes();
		this.useExceptionFilter();
		this.server = this.app.listen(this.port);
		this.logger.log(`Server is running on http://localhost:${this.port}`);
	}
}
