import http from 'http';

const host = '127.0.0.1';
const port = 8000;

const server = http.createServer((req, res) => {
	if (req.url == '/hello') {
		res.statusCode == 200;
		res.setHeader('Content-type', 'text/plain');
		res.end('Привет!');
	} else res.statusCode == 404;
});

server.listen(port, host, () => {
	console.log(`Server's running on ${host}:${port}`);
});
