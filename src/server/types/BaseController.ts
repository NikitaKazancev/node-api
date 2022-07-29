import { NextFunction, Request, Response, Router } from 'express';
import { injectable } from 'inversify';
import 'reflect-metadata';

import ILoggerService from './ILoggerService';

export interface IControllerRoute {
	path: string;
	func: (req: Request, res: Response, next: NextFunction) => void;
	method: keyof Pick<Router, 'get' | 'post' | 'delete' | 'put' | 'patch'>;
}

@injectable()
export default abstract class BaseController {
	private readonly _router: Router;

	constructor(private logger: ILoggerService) {
		this._router = Router();
	}

	public send<T>(res: Response, code: number, message: T): Response {
		res.type('application/json');
		return res.status(code).json(message);
	}

	public ok<T>(res: Response, message: T): Response {
		return this.send<T>(res, 200, message);
	}

	public created(res: Response): Response {
		return res.sendStatus(201);
	}

	get router() {
		return this._router;
	}

	protected bindRoutes(routes: IControllerRoute[]) {
		routes.forEach(({ method, path, func }) => {
			this.logger.log(`[${method}]: ${path}`);
			this.router[method](path, func.bind(this));
		});
	}
}
