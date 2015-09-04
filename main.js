var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var sqlite3 = require('sqlite3').verbose();
var fs = require("fs");
var file = "chatdb.db";
var db = new sqlite3.Database(file);
var exists = fs.existsSync(file);
var users = {};
var currentUsers = 0;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/client.html');
});

io.on('connection', function(socket) {
  var addedUser = false;

    db.each("SELECT register FROM ChatHistory", function(err, row) {
      console.log(row.register);
      io.emit('chat message',{message: row.register});
    });

    socket.on('new message', function(data) {
        console.log('message:', data["message"]);
        io.emit('chat message',{ message: data["message"] });

      	db.run("INSERT INTO ChatHistory VALUES(?)", data["message"]);
    });

  socket.on('add user', function(username) {
    console.log('new user:', username);

    socket.username = username;
    users[username] = username;
    ++currentUsers;
    addedUser = true;

    io.emit('user joined', { username: socket.username});
    db.run("INSERT INTO ChatHistory VALUES(?)", username + ' joined');
   });

  socket.on('disconnect', function () {
    if (addedUser) {
      io.emit('user left', { username: socket.username });
      db.run("INSERT INTO ChatHistory VALUES(?)", socket.username + ' left');

      delete users[socket.username];
      --currentUsers;
    }
  });

});

http.listen(3333, function(){
  console.log('Chat server on localhost:3333');

	if(!exists) {
		db.run("CREATE TABLE ChatHistory (register TEXT)");
	}
});

