import { type UserModel } from '@prisma/client';
import type UserLoginDto from './dto/UserLoginDto';
import type UserRegisterDto from './dto/UserRegisterDto';

export enum GetUserType {
	SUCCESS = 'success',
	INCORRECT_EMAIL = 'incorrect-email',
	INCORRECT_PASSWORD = 'incorrect-password',
}

export type GetUserResponse =
	| {
			user: UserModel;
			type: GetUserType.SUCCESS;
	  }
	| {
			type: GetUserType.INCORRECT_EMAIL | GetUserType.INCORRECT_PASSWORD;
	  };

export default interface IUserService {
	createUser: (dto: UserRegisterDto) => Promise<UserModel | null>;
	getUser: ({ email, password }: UserLoginDto) => Promise<GetUserResponse>;
	getUserId: (email: string) => Promise<number>;
	deleteUser: (dto: UserLoginDto) => Promise<boolean>;
}
