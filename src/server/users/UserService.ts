import { inject, injectable } from 'inversify';
import { ConfigService } from '../services/config/ConfigService';
import Components from '../types/Components';
import { ENV } from '../types/constants';
import UserLoginDto from './dto/UserLoginDto';
import UserRegisterDto from './dto/UserRegisterDto';
import IUserService from './IUserService';
import User from './User';

@injectable()
export default class UserService implements IUserService {
	constructor(
		@inject(Components.IConfigService) private configService: ConfigService
	) {}

	async createUser({
		email,
		name,
		password,
	}: UserRegisterDto): Promise<User | null> {
		const user = new User(email, name);
		await user.setPassword(password, this.configService.get(ENV.SALT));
		return null;
	}

	async validateUser(dto: UserLoginDto): Promise<boolean> {
		return true;
	}
}
