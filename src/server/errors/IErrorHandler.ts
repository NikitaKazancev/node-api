import { NextFunction, Request, Response } from 'express';

export default interface IErrorHandler {
	catch: (err: Error, req: Request, res: Response, next: NextFunction) => void;
}
