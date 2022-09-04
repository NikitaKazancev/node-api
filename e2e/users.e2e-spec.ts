import { boot } from '../src/index';
import App from '../src/server/App';
import request from 'supertest';

let app: App;

beforeAll(async () => {
	const res = await boot;
	app = res.app;
});

const userData = { email: 'my-mail@a.ru', password: '1' };

async function deleteUser(
	code: number,
	userData: {
		email: string;
		password: string;
	}
): Promise<void> {
	if (code == 200) await request(app.app).post('/users/delete').send(userData);
}

describe('Users e2e', () => {
	it('Register - success', async () => {
		const res = await request(app.app)
			.post('/users/register')
			.send({ ...userData, name: 'Nike' });

		const code = res.statusCode;
		await deleteUser(code, userData);

		expect(code).toBe(200);
	});

	it('Register - error', async () => {
		const res = await request(app.app).post('/users/register').send(userData);

		const code = res.statusCode;
		await deleteUser(code, userData);

		expect(code).toBe(422);
	});

	it('Login - success', async () => {
		let res = await request(app.app)
			.post('/users/register')
			.send({ ...userData, name: 'Nike' });

		res = await request(app.app).post('/users/login').send(userData);

		await deleteUser(200, userData);

		expect(res.statusCode).toBe(200);
	});

	it('Login - error', async () => {
		let res = await request(app.app)
			.post('/users/register')
			.send({ ...userData, name: 'Nike' });

		res = await request(app.app)
			.post('/users/login')
			.send({ ...userData, password: userData.password + '1' });

		await deleteUser(200, userData);

		expect(res.statusCode).toBe(401);
	});
});

afterAll(() => {
	app.finish();
});
