const errorPage = `
<html>
	<head>
		<title>404 - File Not Found!</title>
	</head>
	<body>
		<h1>404 - File Not Found!</h1>
		<p>Check your URL, or your typing!!</p>
		<p>Did you mean <a href="/random-joke">random-joke</a>?</p>
	</body>
</html>`;

const get404Response = (request, response) => {
	response.writeHead(400, { "Content-Type": "text/html" }); // send response headers
	response.write(errorPage); // send content
	response.end(); // close connection
};

module.exports.get404Response = get404Response;
