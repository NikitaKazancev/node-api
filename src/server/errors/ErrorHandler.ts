import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';

import Components from '../types/Components';
import IErrorHandler from './IErrorHandler';
import ILoggerService from '../services/logger/ILoggerService';
import HTTPError from './HTTPError';

@injectable()
export default class ErrorHandler implements IErrorHandler {
	constructor(
		@inject(Components.ILoggerService) private logger: ILoggerService
	) {
		logger.log('Error Handler has been ran');
	}

	catch(
		err: Error | HTTPError,
		req: Request,
		res: Response,
		next: NextFunction
	): void {
		if (err instanceof HTTPError) {
			this.logger.error(
				`[${err.context}] Error ${err.message} : ${err.statusCode}`
			);
			res.status(err.statusCode).send({ err: err.message });
		} else {
			this.logger.error(err.message);
			res.status(500).send({ err: err.message });
		}
	}
}
