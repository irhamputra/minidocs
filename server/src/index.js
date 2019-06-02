const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

let value = {
		document: {
				nodes: [
						{
								object: 'block',
								type: 'paragraph',
								nodes: [
										{
												object: 'text',
												text: 'A line of text in a paragraph.'
										},
								],
						},
				],
		},
};

io.on('connection', socket => {
		io.emit('init-value', value);
		socket.on('send-value', () => {
				io.emit('init-value', value)
		})
		socket.on('new-operations', data => {
				value = data.value;
				io.emit('new-remote-operations', data)
		})
});

http.listen(4000, () => {
		console.log('listening on port 4000')
});
