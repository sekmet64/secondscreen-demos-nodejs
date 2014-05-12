var clientPairs = new Array();
var mainScreens = new Array();
var secondScreens = new Array();

var io = require('socket.io');
var wsServer = io.listen(8001, { 'destroy upgrade': false });
console.log("listening on port 8001");


wsServer.sockets.on('connection', function (socket) {
  console.log('Got websocket connection');

  socket.on('message', function (message) {
    console.log('Got message from server: ' + message.command);

    if (message.command == 'connect')
    {
      handleConnect(message.uniqueId, socket);
    }

  });

  socket.on('connect', function (message) {
    console.log('message: ' + message);

    handleConnect(message.uniqueId, socket)
  });

   socket.on('connect-remote', function (message) {
     var id = message.uniqueId;
     console.log('   app   - Remote connected with id: ' + id);


     clientPairs[id].second = socket;
     var mainScreenSocket = clientPairs[id].main;
     mainScreens[socket] = mainScreenSocket;
     secondScreens[mainScreenSocket] = socket;

     mainScreenSocket.emit('remote-connected');


  });


  socket.on('select-video', function(message) {
    var mainScreen = mainScreens[socket];
    mainScreen.emit('select-video', message);
  });

  socket.on('pause', function(message) {
    var mainScreen = mainScreens[socket];
    mainScreen.emit('pause', message);
  });

  socket.on('play', function(message) {
    var mainScreen = mainScreens[socket];
    mainScreen.emit('play', message);
  });

  socket.on('update-time', function(message) {
    var secondScreen = secondScreens[socket];

    secondScreen.emit('update-time', message);
  });
});

function handleConnect(id, socket) {
  console.log('   app   - Desktop connected with id: ' + id);

  if (clientPairs[id] == null)
  {
    clientPairs[id] = new Object();
  }

  clientPairs[id].main = socket;
}