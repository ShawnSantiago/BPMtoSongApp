var five = require("johnny-five"),
    express = require("express"),
    app = express(),
    http = require("http"),
    server = require('http').Server(app);
    io = require('socket.io')(server);

app.use(express.static('public'));
server.listen(8082, function(){
  console.log('listening on *:8082');
});

var board = new five.Board({port: '/dev/cu.usbmodem14141'});

io.on('connection', function(socket){
  console.log('Connected');
  board.on("ready", function() {
    console.log('Board Ready');
    var sensor = new five.Sensor({
      pin: "A0",
      freq: 200
    });

    sensor.scale([ 0, 100 ]).on("change", function() {
      console.log(this.scaled);
      socket.emit('pulse', this.scaled)
    });
  });
});
