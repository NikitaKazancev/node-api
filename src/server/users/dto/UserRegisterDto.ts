import { IsString } from 'class-validator';
import UserLoginDto from './UserLoginDto';

export default class UserRegisterDto extends UserLoginDto {
	@IsString({ message: 'No name specified' })
	name: string;
}
