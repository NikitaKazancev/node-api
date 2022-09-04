import { PrismaClient } from '@prisma/client';
import { inject, injectable } from 'inversify';
import type ILoggerService from '../services/logger/ILoggerService';
import Components from '../types/Components';

@injectable()
export class PrismaService {
	client: PrismaClient = new PrismaClient();

	constructor(
		@inject(Components.ILoggerService) private logger: ILoggerService
	) {
		logger.log('Prisma Service has been ran');
	}

	async connect(): Promise<void> {
		try {
			await this.client.$connect();
			this.logger.log('[PrismaService] Database is connected');
		} catch (error) {
			if (error instanceof Error) {
				this.logger.error(
					`[PrismaService] Connection error: ${error.message}`
				);
			}
		}
	}

	async disconnect(): Promise<void> {
		await this.client.$disconnect();
		this.logger.log('[PrismaService] Database is disconnected');
	}
}
