import { IsEmail, IsString } from 'class-validator';

export default class UserLoginDto {
	@IsEmail({}, { message: 'Incorrect email' })
	email: string;

	@IsString({ message: 'No password specified' })
	password: string;
}
