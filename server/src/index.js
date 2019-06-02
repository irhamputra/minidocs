const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

io.on('connection', socket => {
		socket.on('new-operations', data => {
				io.emit('new-remote-operations', data)
		})
});

http.listen(4000, () => {
		console.log('listening on port 4000')
});
