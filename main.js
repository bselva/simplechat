var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
 
app.get('/', function(req, res){
  res.sendFile(__dirname + '/client.html');
});

io.on('connection', function(socket) {
    socket.on('server_message', function(data) {
        io.emit("client_message",{ message: data["message"] });
        console.log('message', data["message"]);
    });
});

http.listen(3333, function(){
  console.log('Chat server on localhost:3333');
});

