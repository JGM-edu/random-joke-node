const http = require("http");
const url = require("url");
const querystring = require("querystring");
const htmlHandler = require("./htmlResponse");
const jsonHandler = require("./jsonResponse");

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
	notFound: htmlHandler.get404Response,
	"/default-styles": htmlHandler.getDefaultStylesResponse,
	"/default-styles.css": htmlHandler.getDefaultStylesResponse,
	"/joke-client": htmlHandler.getJokeClientResponse,
	"/random-joke": jsonHandler.getRandomJokeResponse,
	"/random-jokes": jsonHandler.getRandomJokesResponse,
};
/** *
 * @param request {Request}
 */
const onRequest = (request, response) => {
	const parsedUrl = url.parse(request.url);
	const { pathname } = parsedUrl;

	const params = querystring.parse(parsedUrl.query);
	/**
	 * @type {String[]}
	 */
	let acceptedTypes = request.headers.accept && request.headers.accept.split(",");
	acceptedTypes = acceptedTypes || [];
	acceptedTypes = acceptedTypes.map((e) => e.trim());

	if (urlStruct[pathname]) {
		urlStruct[pathname](request, response, acceptedTypes, params);
	}
	else {
		urlStruct.notFound(request, response);
	}
};

http.createServer(onRequest).listen(port); // method chaining!

console.log(`Listening on 127.0.0.1: ${port}`);
