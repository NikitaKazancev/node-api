import { Container, ContainerModule, interfaces } from 'inversify';
import App from './server/App.js';
import ErrorHandler from './server/errors/ErrorHandler.js';
import LoggerService from './server/services/LoggerService.js';
import BaseController from './server/types/BaseController.js';
import Components from './server/types/Components.js';
import IErrorHandler from './server/types/IErrorHandler.js';
import ILoggerService from './server/types/ILoggerService.js';
import UserController from './users/UserController.js';

const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILoggerService>(Components.ILoggerService).to(LoggerService);
	bind<IErrorHandler>(Components.IErrorHandler).to(ErrorHandler);
	bind<BaseController>(Components.BaseController).to(UserController);
	bind(Components.App).to(App);
});

function main() {
	const appContainer = new Container();
	appContainer.load(appBindings);
	const app = appContainer.get<App>(Components.App);
	app.init();
	return { appContainer, app };
}

export const { app, appContainer } = main();
