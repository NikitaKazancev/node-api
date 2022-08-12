import { ENV } from '../../types/constants';

export interface IConfigService {
	get: <T extends number>(key: ENV) => T;
}
