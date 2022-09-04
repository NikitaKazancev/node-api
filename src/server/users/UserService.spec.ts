import 'reflect-metadata';
import { UserModel } from '@prisma/client';
import { Container } from 'inversify';
import { IConfigService } from '../services/config/IConfigService';
import Components from '../types/Components';
import { IUserRepository } from './IUserRepository';
import IUserService, { GetUserResponse, GetUserType } from './IUserService';
import User from './User';
import UserService from './UserService';
import ILoggerService from '../services/logger/ILoggerService';
import UserRegisterDto from './dto/UserRegisterDto';

const LoggerServiceMock: ILoggerService = {
	log: jest.fn(),
	error: jest.fn(),
	warn: jest.fn(),
};

const ConfigServiceMock: IConfigService = {
	get: jest.fn(),
};

const UserRepositoryMock: IUserRepository = {
	find: jest.fn(),
	create: jest.fn(),
	delete: jest.fn(),
};

type ExtendedUserService = IUserService & { salt: string | number };

const container = new Container();
let configService: IConfigService;
let userRepository: IUserRepository;
let userService: ExtendedUserService;

beforeAll(() => {
	container.bind<IUserService>(Components.IUserService).to(UserService);
	container
		.bind<IConfigService>(Components.IConfigService)
		.toConstantValue(ConfigServiceMock);
	container
		.bind<IUserRepository>(Components.IUserRepository)
		.toConstantValue(UserRepositoryMock);
	container
		.bind<ILoggerService>(Components.ILoggerService)
		.toConstantValue(LoggerServiceMock);

	configService = container.get<IConfigService>(Components.IConfigService);
	userRepository = container.get<IUserRepository>(Components.IUserRepository);
	userService = container.get<ExtendedUserService>(Components.IUserService);
});

describe('User Service', () => {
	let createdUser: UserModel | null;
	const initialUser: UserRegisterDto = {
		email: 'mail@yandex.ru',
		name: 'Nike',
		password: 'my_pass',
	};
	it('createUser', async () => {
		userRepository.find = jest.fn().mockReturnValueOnce(null);
		userService.salt = 1;

		const id = 1;
		userRepository.create = jest
			.fn()
			.mockImplementationOnce(
				({ email, name, password }: User): UserModel => {
					return { email, name, password, id };
				}
			);

		createdUser = await userService.createUser(initialUser);

		expect(createdUser?.id).toEqual(id);
		expect(createdUser?.password).not.toEqual(initialUser.password);
	});

	it('getUser', async () => {
		userRepository.find = jest.fn().mockReturnValueOnce(null);
		let result: GetUserResponse = await userService.getUser(initialUser);
		expect(result).toEqual<GetUserResponse>({
			type: GetUserType.INCORRECT_EMAIL,
		});

		userRepository.find = jest.fn().mockReturnValueOnce(createdUser);
		result = await userService.getUser(initialUser);
		expect(result).toEqual<GetUserResponse>({
			type: GetUserType.SUCCESS,
			user: createdUser as UserModel,
		});

		userRepository.find = jest.fn().mockReturnValueOnce({
			...createdUser,
			password: createdUser?.password + '1',
		});
		result = await userService.getUser(initialUser);
		expect(result).toEqual<GetUserResponse>({
			type: GetUserType.INCORRECT_PASSWORD,
		});
	});
});
