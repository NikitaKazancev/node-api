import { type UserModel } from '@prisma/client';
import type User from './User';

export interface IUserRepository {
	create: (user: User) => Promise<UserModel>;
	find: (email: string) => Promise<UserModel | null>;
	delete: (id: number) => Promise<UserModel | null>;
}
