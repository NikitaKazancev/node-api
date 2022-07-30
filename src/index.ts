import { Container, ContainerModule, interfaces } from 'inversify';
import App from './server/App';
import ErrorHandler from './server/errors/ErrorHandler';
import LoggerService from './server/services/LoggerService';
import BaseController from './server/types/BaseController';
import Components from './server/types/Components';
import IErrorHandler from './server/types/IErrorHandler';
import ILoggerService from './server/types/ILoggerService';
import UserController from './server/users/UserController';

const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILoggerService>(Components.ILoggerService).to(LoggerService);
	bind<IErrorHandler>(Components.IErrorHandler).to(ErrorHandler);
	bind<BaseController>(Components.BaseController).to(UserController);
	bind(Components.App).to(App);
});

function main(): { appContainer: Container; app: App } {
	const appContainer = new Container();
	appContainer.load(appBindings);
	const app = appContainer.get<App>(Components.App);
	app.init();
	return { appContainer, app };
}

export const { app, appContainer } = main();
