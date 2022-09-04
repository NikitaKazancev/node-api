import {
	config as getConfig,
	type DotenvConfigOutput,
	type DotenvParseOutput,
} from 'dotenv';
import { inject, injectable } from 'inversify';
import Components from '../../types/Components';
import type ILoggerService from '../logger/ILoggerService';
import { ENV } from './ENV';
import { type IConfigService } from './IConfigService';

@injectable()
export class ConfigService implements IConfigService {
	private config: {
		[name: string]: string | number;
	};

	constructor(@inject(Components.ILoggerService) logger: ILoggerService) {
		const result: DotenvConfigOutput = getConfig();
		if (result.error) {
			logger.error("[ConfigService] Couldn't find .env file");
		} else {
			logger.log('[ConfigService] Configuration .env has been loaded');
			this.config = result.parsed as DotenvParseOutput;
			if (this.config[ENV.SALT])
				this.config[ENV.SALT] = +this.config[ENV.SALT];
		}
	}

	get<T extends number | string>(key: ENV): T {
		return this.config[key] as T;
	}
}
