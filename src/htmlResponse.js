const fs = require("fs");

const defaultStyles = fs.readFileSync(`${__dirname}/../client/default-styles.css`);
const errorPage = fs.readFileSync(`${__dirname}/../client/error.html`);

const getDefaultStylesResponse = (request, response) => {
	response.writeHead(200, { "Content-Type": "text/css" }); // send response headers
	response.write(defaultStyles); // send content
	response.end(); // close connection
};

const get404Response = (request, response) => {
	response.writeHead(400, { "Content-Type": "text/html" }); // send response headers
	response.write(errorPage); // send content
	response.end(); // close connection
};

module.exports.getDefaultStylesResponse	= getDefaultStylesResponse;
module.exports.get404Response			= get404Response;
