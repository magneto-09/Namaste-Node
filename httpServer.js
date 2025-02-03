const http = require('http');

const server = http.createServer((req, res) => {
res.end("Hello World")
}); 

server.listen(8080);


// OLD way to do things. creating server (software server or application) using http module will become
// complex to handle

// Hence, use Express. express -> framework of Node.js. it is built on top of Node.js

