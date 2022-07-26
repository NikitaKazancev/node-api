import { ClassConstructor, plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import type { Request, Response } from 'express';
import type { NextFunction } from 'express-serve-static-core';
import HTTPError from '../errors/HTTPError';
import type IMiddleware from './IMiddleware';

export class ValidateMiddleware implements IMiddleware {
	constructor(private classToValidate: ClassConstructor<object>) {}

	execute({ body }: Request, res: Response, next: NextFunction): void {
		const instance = plainToClass(this.classToValidate, body);
		validate(instance).then(errors => {
			if (errors.length) {
				const message = JSON.stringify([
					...errors.map(({ property, value, constraints }) => ({
						[property]: value,
						constraints,
					})),
				]);
				next(new HTTPError(422, message, 'Validation'));
			} else next();
		});
	}
}
