import { UserModel } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { PrismaService } from '../database/PrismaService';
import Components from '../types/Components';
import { IUserRepository } from './IUserRepository';
import User from './User';

@injectable()
export class UserRepository implements IUserRepository {
	constructor(
		@inject(Components.PrismaService) private prismaService: PrismaService
	) {}

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
}
