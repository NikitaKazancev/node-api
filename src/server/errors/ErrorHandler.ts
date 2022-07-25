import { NextFunction, Request, Response } from 'express';
import IErrorHandler from '../types/IErrorHandler.js';
import ILoggerService from '../types/ILoggerService.js';
import HTTPError from './HTTPError.js';

export default class ErrorHandler implements IErrorHandler {
	constructor(public logger: ILoggerService) {
		logger.log('Error handler has been ran');
	}

	catch(
		err: Error | HTTPError,
		req: Request,
		res: Response,
		next: NextFunction
	) {
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
