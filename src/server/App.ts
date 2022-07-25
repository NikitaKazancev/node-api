import express, { Express } from 'express';
import { Server } from 'http';
import { userRouter } from '../users/users.js';

export default class App {
	app: Express = express();
	server: Server | undefined;
	port = 8000;

	private use() {
		this.app.use('/users?', userRouter);
	}

	public init() {
		this.use();
		this.server = this.app.listen(this.port);
		console.log(`Server is running on http://localhost:${this.port}`);
	}
}
