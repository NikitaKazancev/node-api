import { ENV } from '../../types/constants';

export interface IConfigService {
	get: <T extends string | number>(key: ENV) => T;
}
