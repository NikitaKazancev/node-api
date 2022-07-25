import App from './server/App.js';
import ErrorHandler from './server/errors/ErrorHandler.js';
import LoggerService from './server/services/LoggerService.js';
import UserController from './users/UserController.js';

async function main() {
	const logger = new LoggerService();
	const userController = new UserController(logger);
	const errorHandler = new ErrorHandler(logger);
	const app = new App(logger, userController, errorHandler);
	app.init();
}

main();
