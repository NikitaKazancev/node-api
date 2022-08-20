import { UserModel } from '@prisma/client';
import UserLoginDto from './dto/UserLoginDto';
import UserRegisterDto from './dto/UserRegisterDto';

export type IGetUserResponse =
	| {
			user: UserModel;
			type: 'success';
	  }
	| {
			type: 'incorrect-email' | 'incorrect-password';
	  };

export default interface IUserService {
	createUser: (dto: UserRegisterDto) => Promise<UserModel | null>;
	getUser: ({ email, password }: UserLoginDto) => Promise<IGetUserResponse>;
	getUserId: (email: string) => Promise<number>;
	deleteUser: (dto: UserLoginDto) => Promise<boolean>;
}
