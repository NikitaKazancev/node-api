import { injectable } from 'inversify';
import { Logger } from 'tslog';
import 'reflect-metadata';

import ILoggerService from './ILoggerService';

@injectable()
export default class LoggerService implements ILoggerService {
	private logger: Logger = new Logger({
		displayInstanceName: false,
		displayLoggerName: false,
		displayFilePath: 'hidden',
		displayFunctionName: false,
	});

	log(...args: unknown[]): void {
		this.logger.info(...args);
	}

	error(...args: unknown[]): void {
		this.logger.error(...args);
	}

	warn(...args: unknown[]): void {
		this.logger.warn(...args);
	}
}
