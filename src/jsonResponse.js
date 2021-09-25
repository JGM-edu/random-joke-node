const jsdom = require("jsdom");

const { JSDOM } = jsdom;

/* global document */
global.document = new JSDOM("<!DOCTYPE html><p>Hello world</p>").window.document;

const jokes = [
	{ q: "What do you call a very small valentine?",						a: "A valen-tiny!" },
	{ q: "What did the dog say when he rubbed his tail on the sandpaper?",	a: "Ruff, Ruff!" },
	{ q: "Why don't sharks like to eat clowns?",							a: "Because they taste funny!" },
	{ q: "What did the boy cat say to the girl cat?",						a: "You're Purr-fect!" },
	{ q: "What is a frog's favorite outdoor sport?",						a: "Fly Fishing!" },
	{ q: "I hate jokes about German sausages.",								a: "They're the wurst." },
	{ q: "Did you hear about the cheese factory that exploded in France?",	a: "There was nothing left but de Brie." },
	{ q: "Our wedding was so beautiful. ",									a: "Even the cake was in tiers." },
	{ q: "Is this pool safe for diving?",									a: "It deep ends." },
	{ q: "Dad, can you put my shoes on?",									a: "I dont think they'll fit me." },
	{ q: "Can February March?",												a: "No, but April May" },
	{ q: "What lies at the bottom of the ocean and twitches?",				a: "A nervous wreck." },
	{ q: "I'm reading a book on the history of glue.",						a: "I just can't seem to put it down." },
	{ q: "Dad, can you put the cat out?",									a: "I didnt know it was on fire." },
	{ q: "What did the ocean say to the sailboat?",							a: "Nothing, it just waved." },
	{ q: "What do you get when you cross a snowman with a vampire?",		a: "Frostbite" },
];

// ALWAYS GIVE CREDIT - in your code comments and documentation
// Source: https://stackoverflow.com/questions/2219526/how-many-bytes-in-a-javascript-string/29955838
// Refactored to an arrow function by ACJ
const getBinarySize = (string) => Buffer.byteLength(string, "utf8");

const getRandomJokes = (acceptedTypes, limit = 1) => {
	// #region Sanitize input
	let limit2 = Number(limit);
	limit2 = (!limit2 || limit2 < 1 || limit2 >= jokes.length) ? 1 : limit2;
	limit2 = Math.floor(limit2);
	limit2 = (limit2 < 1) ? 1 : limit2;
	// #endregion

	// #region Get Joke(s)
	const generatedIndicies = [];
	for (let loop = 0; loop < limit2; loop++) {
		let curr;
		do {
			curr = Math.floor(Math.random() * jokes.length);
		} while (generatedIndicies.indexOf(curr) >= 0);
		generatedIndicies.push(curr);
	}
	let thing = generatedIndicies.map((val) => jokes[val]);
	if (thing.length === 1) [thing] = thing;
	// #endregion

	// #region Generate Response
	let root;
	if (acceptedTypes.indexOf("application/json") >= 0 || acceptedTypes.indexOf("text/xml") < 0) {
		root = JSON.stringify(thing);
	}
	else if (acceptedTypes.indexOf("text/xml") >= 0) {
		if (thing.length) {
			root = document.createElement("jokes");
			thing.forEach((elem) => {
				const newElem = document.createElement("joke");
				const newQ	= document.createElement("q");
				const newA	= document.createElement("a");
				newQ.innerHTML = elem.q;
				newElem.appendChild(newQ);
				newA.innerHTML = elem.a;
				newElem.appendChild(newA);
				root.appendChild(newElem);
			});
		}
		else {
			root = document.createElement("joke");
			const newQ	= document.createElement("q");
			const newA	= document.createElement("a");
			newQ.innerHTML = thing.q;
			root.appendChild(newQ);
			newA.innerHTML = thing.a;
			root.appendChild(newA);
		}
		root = `<?xml version="1.0" ?>
		${root.outerHTML}`;
	}
	// #endregion

	return root;
};

// const getRandomJokeJSON = (limit = 1) => {
// 	return JSON.stringify(getRandomJokes(limit));
// };

// const getRandomJokeXML = (limit = 1) => {
// 	let thing = getRandomJokes(limit);
// 	/***
// 	 * @type {HTMLElement}
// 	 */
// 	let root;
// 	if (thing.length) {
// 		root = document.createElement('jokes');
// 		thing.forEach((elem) => {
// 			let newElem = document.createElement('joke'),
// 				newQ	= document.createElement('q'),
// 				newA	= document.createElement('a');
// 			newQ.innerText = elem.q;
// 			newA.innerText = elem.a;
// 			root.appendChild(newElem.appendChild(newQ).appendChild(newA));
// 		});
// 	}
// 	else {
// 		root = document.createElement('joke');
// 		let newQ	= document.createElement('q'),
// 			newA	= document.createElement('a');
// 		newQ.innerText = elem.q;
// 		newA.innerText = elem.a;
// 		root.appendChild(newQ).appendChild(newA);
// 	}
// 	let x = new XMLSerializer();
// 	return x.serializeToString(root);
// };

/**
 *
 * @param {Request} request
 * @param {Response} response
 * @param {*} acceptedTypes
 * @param {*} params
 */
const getRandomJokesResponse = (request, response, acceptedTypes, params) => {
	if (request.method === "HEAD" || request.method === "head") response.writeHead(200, { "Content-Type": (acceptedTypes.indexOf("text/xml") >= 0 && acceptedTypes.indexOf("application/json") < 0) ? "text/xml" : "application/json", "Content-Length": getBinarySize(getRandomJokes(acceptedTypes, params.limit)) }); // send response headers
	else {
		response.writeHead(200, { "Content-Type": (acceptedTypes.indexOf("text/xml") >= 0 && acceptedTypes.indexOf("application/json") < 0) ? "text/xml" : "application/json" }); // send response headers
		response.write(getRandomJokes(acceptedTypes, params.limit)); // send content
	}
	response.end(); // close connection
};

const getRandomJokeResponse = (request, response, acceptedTypes) => {
	if (request.method === "HEAD" || request.method === "head") {
		response.writeHead(200, { "Content-Type": (acceptedTypes.indexOf("text/xml") >= 0 && acceptedTypes.indexOf("application/json") < 0) ? "text/xml" : "application/json", "Content-Length": getBinarySize(getRandomJokes(acceptedTypes)) }); // send response headers
	}
	else {
		response.writeHead(200, { "Content-Type": (acceptedTypes.indexOf("text/xml") >= 0 && acceptedTypes.indexOf("application/json") < 0) ? "text/xml" : "application/json" }); // send response headers
		response.write(getRandomJokes(acceptedTypes)); // send content
	}
	response.end(); // close connection
};

module.exports.getRandomJokeResponse	= getRandomJokeResponse;
module.exports.getRandomJokesResponse	= getRandomJokesResponse;
