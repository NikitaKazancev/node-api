import { injectable } from 'inversify';
import { Logger } from 'tslog';
import 'reflect-metadata';

import ILoggerService from '../types/ILoggerService.js';

@injectable()
export default class LoggerService implements ILoggerService {
	private logger: Logger = new Logger({
		displayInstanceName: false,
		displayLoggerName: false,
		displayFilePath: 'hidden',
		displayFunctionName: false,
	});

	log(...args: unknown[]) {
		this.logger.info(...args);
	}

	error(...args: unknown[]) {
		this.logger.error(...args);
	}

	warn(...args: unknown[]) {
		this.logger.warn(...args);
	}
}
