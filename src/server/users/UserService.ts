import { type UserModel } from '@prisma/client';
import { compare, hash } from 'bcryptjs';
import { inject, injectable } from 'inversify';
import { type ConfigService } from '../services/config/ConfigService';
import Components from '../types/Components';
import { ENV } from '../services/config/ENV';
import type UserLoginDto from './dto/UserLoginDto';
import type UserRegisterDto from './dto/UserRegisterDto';
import { type IUserRepository } from './IUserRepository';
import IUserService, {
	GetUserType,
	type GetUserResponse,
} from './IUserService';
import User from './User';
import type ILoggerService from '../services/logger/ILoggerService';

@injectable()
export default class UserService implements IUserService {
	private salt: string | number;

	constructor(
		@inject(Components.IConfigService) configService: ConfigService,
		@inject(Components.IUserRepository)
		private userRepository: IUserRepository,
		@inject(Components.ILoggerService) logger: ILoggerService
	) {
		logger.log('[User] Service has been ran');
		this.salt = configService.get(ENV.SALT);
	}

	async createUser({
		email,
		name,
		password,
	}: UserRegisterDto): Promise<UserModel | null> {
		const existedUser = await this.userRepository.find(email);
		if (existedUser) return null;

		return this.userRepository.create(
			new User(email, name, await hash(password, this.salt))
		);
	}

	async getUserId(email: string): Promise<number> {
		const existedUser = await this.userRepository.find(email);
		if (!existedUser) return -1;
		return existedUser.id;
	}

	async getUser({ email, password }: UserLoginDto): Promise<GetUserResponse> {
		const existedUser = await this.userRepository.find(email);
		if (!existedUser) return { type: GetUserType.INCORRECT_EMAIL };

		if (await compare(password, existedUser.password))
			return { user: existedUser, type: GetUserType.SUCCESS };
		return { type: GetUserType.INCORRECT_PASSWORD };
	}

	async deleteUser({ email, password }: UserLoginDto): Promise<boolean> {
		const res: GetUserResponse = await this.getUser({ email, password });
		if (res.type != 'success') return false;
		else return !!(await this.userRepository.delete(res.user.id));
	}
}
