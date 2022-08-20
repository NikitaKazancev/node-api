import { ENV } from './ENV';

export interface IConfigService {
	get: <T extends number | string>(key: ENV) => T;
}
