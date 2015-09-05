var socketio = io.connect("127.0.0.1:3333");
var username = "New user";
var first = true;

socketio.on('chat history', function(data) {
    if(first){
        document.getElementById("chatboard").innerHTML = (document.getElementById("chatboard").innerHTML 
            + "<li>" + data['message']);
    }
});

socketio.on('chat message', function(data) {
    document.getElementById("chatboard").innerHTML = (document.getElementById("chatboard").innerHTML 
        + "<li>" + data['message']);
});

socketio.on('user joined', function(data) {
    console.log(data.username + ' joined');
    document.getElementById("chatboard").innerHTML = (document.getElementById("chatboard").innerHTML 
        + "<li>" + data.username + ' joined');
});

socketio.on('user left', function(data) {
    console.log(data.username + ' left');
    document.getElementById("chatboard").innerHTML = (document.getElementById("chatboard").innerHTML 
        + "<li>" + data.username + ' left');
});

function getFormattedDate() {
   var currentdate = new Date(); 

    var datetime = " [" + currentdate.getDate() + "/"
                    + (currentdate.getMonth()+1)  + "/" 
                    + currentdate.getFullYear() + " "  
                    + currentdate.getHours() + ":"  
                    + currentdate.getMinutes() + ":" 
                    + currentdate.getSeconds() + "] " ;
    return datetime;
}

function sendMessage() {

    var msg = getFormattedDate() + username + ": " + document.getElementById("text_message").value;
    socketio.emit('new message', { message : msg});
    document.getElementById("text_message").value="";
}

function setUsername() {
var nick = document.getElementById("nickname").value;
username = nick;

    if(first) {
        socketio.emit('add user', nick);
        first = false;
        $( "#dialog" ).dialog('close');
    }
}

$(function() {
    $( "#dialog" ).dialog({
        height: 100,
        width: 350,
        modal: true,
        dialogClass: 'no-close'                    
    });
  });

