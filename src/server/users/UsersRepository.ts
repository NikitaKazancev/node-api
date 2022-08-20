import { UserModel } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { PrismaService } from '../database/PrismaService';
import ILoggerService from '../services/logger/ILoggerService';
import Components from '../types/Components';
import { IUserRepository } from './IUserRepository';
import User from './User';

@injectable()
export class UserRepository implements IUserRepository {
	constructor(
		@inject(Components.PrismaService) private prismaService: PrismaService,
		@inject(Components.ILoggerService) logger: ILoggerService
	) {
		logger.log('[User] Repository has been ran');
	}

	async create({ email, name, password }: User): Promise<UserModel> {
		return this.prismaService.client.userModel.create({
			data: { email, name, password },
		});
	}

	async find(email: string): Promise<UserModel | null> {
		return this.prismaService.client.userModel.findFirst({
			where: { email },
		});
	}

	async delete(id: number): Promise<UserModel | null> {
		return this.prismaService.client.userModel.delete({ where: { id } });
	}
}
