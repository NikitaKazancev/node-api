import express from 'express';
import { Request, Response, NextFunction } from 'express';

const port = 8000;
const app = express();

app.all('/hello', (req, res, next) => {
	console.log('All');
	next();
});

const cb1 = (req: Request, res: Response, next: NextFunction) => {
	console.log('CB1');
	next();
};

const cb2 = (req: Request, res: Response, next: NextFunction) => {
	console.log('CB2');
	next();
};

// app.get('/hello', [
// 	cb1,
// 	cb2,
// 	(req: Request, res: Response, next: NextFunction) => {
// 		res.send('<h1>Привет!</h1>');
// 	},
// ]);

// app.get('/users/:userId/books/:bookId', (req, res) => {
// 	res.send(req.params);
// });

app.get('/hello', (req, res, next) => {
	// res.status(201).send({ success: true });
	// res.download('./test.txt');
	// res.redirect(301, 'https://www.google.com/search?q=%D0%BA%D1%83%D1%80%D1%81+%D0%B4%D0%BE%D0%BB%D0%BB%D0%B0%D1%80%D0%B0&oq=&aqs=chrome.0.35i39i362l8.231829314j0j15&sourceid=chrome&ie=UTF-8')

	// res.append('Warning', 'code');
	// // res.set('Content-Type', 'text/plain');
	// res.type('html');
	// res.cookie('token', '24fe24fs', {
	// 	domain: '',
	// 	path: '',
	// 	secure: true,
	// 	expires: new Date(6000000),
	// });
	// res.clearCookie('token');
	// res.send('Hello!');

	res.status(404).end();
});

app.route('/hello')
	.all((_, __, next) => {
		console.log('All');
		next();
	})
	.get((req, res) => {
		res.status(404).end();
	})
	.post();

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
