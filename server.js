var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var shortid = require('shortid');

// Serve static files
app.use(express.static('public'));

function log(msg) {
  var date = new Date();
  console.log(date+' : '+msg);
}

// Game
var game = {
  time: 120, // Time left
  players: [],
  timer: null,
  start: function() {
    var context = this;
    this.time = 120;
    this.timer = setInterval( function() { context.onesec(); }, 1000);
    log('New game starting');
  },
  onesec: function() {
    this.time -= 1;
    if (this.time <= 0) {
      clearInterval(this.timer);
      this.start();
    }
    log('Time left: '+this.time+' sec.');
  }
};

// Player
Player = function(x, y, role) {
  this.id = shortid.generate();
  this.x = x || 0;
  this.y = y || 0;
  this.role = role || 'prisoner'; // prisoner or tower
};

// Bot
Bot = function(x, y) {
  this.id = shortid.generate();
  this.x = x || 0;
  this.y = y || 0;
};

// Start game
game.start();

// Socket IO
io.on('connection', function(socket) {
  
  // Create a new Player
  socket.player = new Player();
  game.players.push(socket.player);
  
  log('Player '+socket.player.id+' created');
  
  // Send players list to new player
  socket.emit('players', game.players);
  
  // Broadcast new player to all players
  socket.broadcast.emit('player', socket.player);
  
  // When player disconnect
  socket.on('disconnect', function() {
    
    // Remove player from array
    var index = game.players.indexOf(socket.player);
    if (index > -1) {
      game.players.splice(index, 1);
    }
    
    log('Player '+socket.player.id+' disconnected');
  });
  
});

http.listen(3000, function(){
  log('Server listening on *:3000');
});
