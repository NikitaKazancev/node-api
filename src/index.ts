import express from 'express';
import { Request, Response, NextFunction } from 'express';
import { userRouter } from './users/users.js';

const port = 8000;
const app = express();

app.use('/users?', userRouter);

app.get('/hello', (req, res) => {
	// res.send('Hello');
	throw new Error('Error!!!');
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	res.status(500).send(err.message);
	next();
});

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
