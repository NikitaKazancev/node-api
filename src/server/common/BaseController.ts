import {
	type NextFunction,
	type Request,
	type Response,
	Router,
} from 'express';
import { injectable } from 'inversify';
import 'reflect-metadata';

import type ILoggerService from '../services/logger/ILoggerService';
import type IMiddleware from '../middlewares/IMiddleware';

export interface IControllerRoute {
	path: string;
	func: (req: Request, res: Response, next: NextFunction) => void;
	method: keyof Pick<Router, 'get' | 'post' | 'delete' | 'put' | 'patch'>;
	middlewares?: IMiddleware[];
}

@injectable()
export default abstract class BaseController {
	private readonly _router: Router;
	protected generalPath: string;

	constructor(private logger: ILoggerService) {
		this._router = Router();
	}

	public send<T>(res: Response, code: number, message: T): Response {
		res.type('application/json');
		return res.status(code).json(message);
	}

	public ok<T extends { data?: any; message?: string }>(
		res: Response,
		data: T
	): Response {
		return this.send<T>(res, 200, data);
	}

	public created(res: Response): Response {
		return res.sendStatus(201);
	}

	get router(): Router {
		return this._router;
	}

	protected bindRoutes(routes: IControllerRoute[]): void {
		routes.forEach(({ method, path, func, middlewares }) => {
			this.logger.log(`[${method}]: ${this.generalPath}${path}`);

			const handler = func.bind(this);
			const middleware = middlewares?.map(m => m.execute.bind(m));
			const pipeline = middleware ? [...middleware, handler] : handler;

			this.router[method](path, pipeline);
		});
	}

	public exec(path: string): Router {
		this.generalPath = path;
		return this.router;
	}
}
