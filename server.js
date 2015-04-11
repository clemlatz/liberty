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
  time: 120,
  sockets: [],
  players: [],
  timer: null,
  start: function() {
    var context = this;
    
    // Reset time left to 120 seconds
    this.time = 120;
    this.timer = setInterval( function() { context.tick(); }, 1000);
    
    // Add 10 random bots
    var bot;
    game.bots = [];
    for(i = 0; i < 10; i++) {
      bot = new Bot();
      game.bots.push(bot);
    }
    
    log('New game starting');
  },
  tick: function() {
    
    // Remove 1 second from time left
    this.time -= 1;
    
    io.sockets.emit('time', this.time)
    
    // If time is up, start a new game
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

// On player connection
io.on('connection', function(socket) {
  
  // Add new user to socket list
  game.sockets.push(socket);
  
  // Create a new Player
  socket.player = new Player();
  game.players.push(socket.player);
  log('Player '+socket.player.id+' created');
  
  // Send players & bots to new player
  socket.emit('players', game.players);
  socket.emit('bots', game.bots);
  
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
