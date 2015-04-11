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
  time: 10,
  sockets: [],
  players: [],
  tower: null,
  timer: null,
  map: {
    height: 2688,
    width: 4096
  },
  start: function() {
    var context = this;
    
    
    log('New game starting...');
    
    // Reset time left to 120 seconds
    this.time = 30;
    this.timer = setInterval( function() { context.tick(); }, 1000);
    
    // Reset roles for all players
    for (i = 0, c = this.players.length; i < c; i++) {
      this.players[i].role = 'prisoner';
    }
    
    // Set a random player to be the in watch tower
    var new_tower = this.players[Math.floor(Math.random() * this.players.length)];
    if (new_tower) {
      this.tower = new_tower;
      this.tower.role = 
      log('Player '+this.tower.id+' is in the watchtower');
    }
    
    // Add 10 random bots
    var bot;
    game.bots = [];
    for(i = 0; i < 10; i++) {
      bot = new Bot();
      game.bots.push(bot);
    }
    io.sockets.emit('bots', game.bots); // Push bots to players
    
    log('New game started!');
  },
  tick: function() {
    
    // Remove 1 second from time left
    this.time -= 1;
    
    io.sockets.emit('time', this.time);
    
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
  socket.emit('role', socket.player.role)
  socket.emit('players', game.players);
  socket.emit('bots', game.bots);
  
  // Broadcast new player to all players
  socket.broadcast.emit('player', socket.player);
  
  // Player moving
  socket.on('move', function(dir) {
    
    if (dir == "up" && socket.player.y > 0) {
      socket.player.y -= 1;
    } else if (dir == "down" && socket.player.y < game.map.height) {
      socket.player.y += 1;
    } else if (dir == "left" && socket.player.x > 0) {
      socket.player.x -= 1;
    } else if (dir == "right" && socket.player.x < game.map.width) {
      socket.player.x += 1;
    }
    
    socket.broadcast.emit('player', socket.player);
    
    log('Player '+socket.player.id+' moved '+dir);
    
  });
  
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
