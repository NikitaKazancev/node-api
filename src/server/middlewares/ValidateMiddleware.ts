import { ClassConstructor, plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response } from 'express';
import { NextFunction } from 'express-serve-static-core';
import HTTPError from '../errors/HTTPError';
import IMiddleware from '../types/IMiddleware';

export class ValidateMiddleware implements IMiddleware {
	constructor(private classToValidate: ClassConstructor<object>) {}

	execute({ body }: Request, res: Response, next: NextFunction): void {
		const instance = plainToClass(this.classToValidate, body);
		validate(instance).then(errors => {
			// if (errors.length) res.status(422).send(errors);
			if (errors.length) {
				const message = JSON.stringify([
					...errors.map(({ property, value, constraints }) => ({ [property]: value, constraints })),
				]);
				next(new HTTPError(422, message, 'Validation'));
			} else next();
		});
	}
}
