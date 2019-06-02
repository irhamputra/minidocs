const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const cors = require('cors');

const initialEditorValue = {
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

const groupData = {};

io.on('connection', socket => {
		socket.on('new-operations', data => {
				groupData[data.groupId] = data.value;
				io.emit(`new-remote-operations-${data.groupId}`, data)
		})
});

app.use(cors({
		origin: 'http://localhost:3000' // change this to your frontend
}));

app.get('/group/:id', (req, res) => {
		const {id} = req.params;
		if (!(id in groupData)) {
				groupData[id] = initialEditorValue
		}
		res.send(groupData[id])
});

http.listen(4000, () => {
		console.log('listening on port 4000')
});
