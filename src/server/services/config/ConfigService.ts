import { config as getConfig, DotenvConfigOutput, DotenvParseOutput } from 'dotenv';
import { inject, injectable } from 'inversify';
import Components from '../../types/Components';
import { ENV } from '../../types/constants';
import ILoggerService from '../logger/ILoggerService';
import { IConfigService } from './IConfigService';

@injectable()
export class ConfigService implements IConfigService {
	private config: DotenvParseOutput;

	constructor(@inject(Components.ILoggerService) logger: ILoggerService) {
		const result: DotenvConfigOutput = getConfig();
		if (result.error) {
			logger.error("[ConfigService] Couldn't find .env file");
		} else {
			logger.log('[ConfigService] Configuration .env has been loaded');
			this.config = result.parsed as DotenvParseOutput;
		}
	}

	get<T extends string | number>(key: ENV): T {
		return this.config[key] as T;
	}
}
