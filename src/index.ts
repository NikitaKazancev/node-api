import { Container, ContainerModule, interfaces } from 'inversify';
import App from './server/App';
import ErrorHandler from './server/errors/ErrorHandler';
import LoggerService from './server/services/logger/LoggerService';
import BaseController from './server/common/BaseController';
import Components from './server/types/Components';
import IErrorHandler from './server/errors/IErrorHandler';
import ILoggerService from './server/services/logger/ILoggerService';
import UserController from './server/users/UserController';
import IUserService from './server/users/IUserService';
import UserService from './server/users/UserService';
import { IConfigService } from './server/services/config/IConfigService';
import { ConfigService } from './server/services/config/ConfigService';
import { PrismaService } from './server/database/PrismaService';
import { IUserRepository } from './server/users/IUserRepository';
import { UserRepository } from './server/users/UsersRepository';

const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILoggerService>(Components.ILoggerService)
		.to(LoggerService)
		.inSingletonScope();
	bind<IErrorHandler>(Components.IErrorHandler)
		.to(ErrorHandler)
		.inSingletonScope();
	bind<BaseController>(Components.BaseController)
		.to(UserController)
		.inSingletonScope();
	bind<IUserService>(Components.IUserService)
		.to(UserService)
		.inSingletonScope();
	bind<IConfigService>(Components.IConfigService)
		.to(ConfigService)
		.inSingletonScope();
	bind<PrismaService>(Components.PrismaService)
		.to(PrismaService)
		.inSingletonScope();
	bind<IUserRepository>(Components.IUserRepository)
		.to(UserRepository)
		.inSingletonScope();
	bind<App>(Components.App).to(App).inSingletonScope();
});

async function main(): Promise<{ appContainer: Container; app: App }> {
	const appContainer = new Container();
	appContainer.load(appBindings);
	const app = appContainer.get<App>(Components.App);
	await app.init();
	return { appContainer, app };
}

export const boot = main();
