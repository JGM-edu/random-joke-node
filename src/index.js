const http = require("http");
const url = require("url");
const htmlHandler = require("./htmlResponse");
const jsonHandler = require("./jsonResponse");

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
	notFound: htmlHandler.get404Response,
	"/random-joke": jsonHandler.getRandomJokeResponse,
};

const onRequest = (request, response) => {
	const parsedUrl = url.parse(request.url);
	const { pathname } = parsedUrl;

	if (urlStruct[pathname]) {
		urlStruct[pathname](request, response);
	}
	else {
		urlStruct.notFound(request, response);
	}
};

http.createServer(onRequest).listen(port); // method chaining!

console.log(`Listening on 127.0.0.1: ${port}`);
