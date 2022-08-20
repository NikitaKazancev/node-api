import { UserModel } from '@prisma/client';
import User from './User';

export interface IUserRepository {
	create: (user: User) => Promise<UserModel>;
	find: (email: string) => Promise<UserModel | null>;
	delete: (id: number) => Promise<UserModel | null>;
}
