import { UserModel } from '@prisma/client';
import { compare, genSalt, hash } from 'bcryptjs';
import { inject, injectable } from 'inversify';
import { ConfigService } from '../services/config/ConfigService';
import Components from '../types/Components';
import { ENV } from '../types/constants';
import UserLoginDto from './dto/UserLoginDto';
import UserRegisterDto from './dto/UserRegisterDto';
import { IUserRepository } from './IUserRepository';
import IUserService from './IUserService';
import User from './User';

@injectable()
export default class UserService implements IUserService {
	private salt: number;

	constructor(
		@inject(Components.IConfigService) private configService: ConfigService,
		@inject(Components.IUserRepository)
		private userRepository: IUserRepository
	) {
		this.salt = configService.get(ENV.SALT);
	}

	private async getPassword(pass: string, salt: number): Promise<string> {
		return await hash(pass, salt);
	}

	private async comparePasswords(
		pass: string,
		hashPassword: string
	): Promise<boolean> {
		return await compare(pass, hashPassword);
	}

	async createUser({
		email,
		name,
		password,
	}: UserRegisterDto): Promise<UserModel | null> {
		const existedUser = await this.userRepository.find(email);
		if (existedUser) return null;

		const user = new User(
			email,
			name,
			await this.getPassword(password, this.salt)
		);

		return this.userRepository.create(user);
	}

	async checkUser({ email, password }: UserLoginDto): Promise<boolean> {
		const existedUser = await this.userRepository.find(email);
		if (!existedUser) return false;
		if (await this.comparePasswords(password, existedUser.password))
			return true;
		return false;
	}
}
