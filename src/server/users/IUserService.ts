import { UserModel } from '@prisma/client';
import UserLoginDto from './dto/UserLoginDto';
import UserRegisterDto from './dto/UserRegisterDto';

export default interface IUserService {
	createUser: (dto: UserRegisterDto) => Promise<UserModel | null>;
	checkUser: (dto: UserLoginDto) => Promise<boolean>;
}
