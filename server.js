
var app_version = '2';

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var shortid = require('shortid');

// Set port
app.set('port', (process.env.PORT || 3000));

// Serve static files
app.use(express.static('public'));

function log(msg) {
  var date = new Date();
  console.log(date+' : '+msg);
  io.sockets.emit('log', date+' : '+msg);
}

function rand(min, max) {
  return Math.floor(Math.random() * max) + min;
}

// Game
var game = {
  duration: 10, // duration of a game
  waitDuration: 10, // duration between game
  time: this.duration, // time left on current game
  sockets: [],
  players: [],
  guard: null,
  timer: null,
  botNum: 3,
  map: {
    height: 400,
    width: 400
  },
  start: function() {
    var context = this;
    
    log('New game starting...');
    
    // Reset time left to game duration
    this.time = this.duration;
    this.timer = setInterval( function() { context.tick(); }, 1000);
    
    // Reset roles & positions of all players
    for (i = 0, c = this.players.length; i < c; i++) {
      this.players[i].role = 'prisoner';
      this.players[i].x = 0;
      this.players[i].y = Math.floor(Math.random() * this.map.height);
    }
    
    // Set a random player to be the in watch tower
    var new_guard = this.players[Math.floor(Math.random() * this.players.length)];
    if (new_guard) {
      this.guard = new_guard;
      this.guard.role = 'guard';
      log('Player '+this.guard.id+' is the guard');
    }
    
    // Add random bots
    var bot;
    game.bots = [];
    for(i = 0; i < this.botNum; i++) {
      bot = new Bot();
      game.bots.push(bot);
    }
    
    io.sockets.emit('start', this.players.concat(this.bots)); // Push bots & players
    
    log('New game started!');
  },
  tick: function() {
    
    // Remove 1 second from time left
    this.time -= 1;
    
    io.sockets.emit('time', this.time);
    
    // If time is up, start a new game
    if (this.time <= 0) {
      clearInterval(this.timer);
      this.stop();
      return;
    }
    
    // Random bots movement
    for (i = 0, c = game.bots.length; i < c; i++) {
      game.bots[i].move(io);
    }
  },
  stop: function() {
    var context = this;
          
    // Broadcast end of game
    io.sockets.emit('stop', this.time);
    
    // Game stoped
    log('Game stopped!');
    
    // After waitDuration time, start a new game
    setTimeout( function() { context.start(); }, this.waitDuration * 1000);
  }
};

// Player
Player = function(x, y, role) {
  this.id = shortid.generate();
  this.x = x || 0;
  this.y = y || Math.floor(Math.random() * game.map.height);
  this.username = null;
  this.role = role || 'prisoner'; // prisoner or gard
};

// Bot
Bot = function(x, y) {
  this.id = shortid.generate();
  this.x = x || 0;
  this.y = y || Math.floor(Math.random() * game.map.height);
  this.role = 'prisoner'; // bots are always prisoners
};

Bot.prototype.move = function(io) {
  var context = this,
    delay = rand(0, 1000);

  this.x += rand(0, 10);
  this.y += rand(-10, 10);
  
  setTimeout( function() { io.sockets.emit('player', context); }, delay);
};

// Start game
game.start();

// On player connection
io.on('connection', function(socket) {
  
  socket.emit('connected', app_version);
  
  socket.on('name', function(name) {
    
    // Create a new Player
    socket.player = new Player();
    socket.player.name = name;
    game.players.push(socket.player);
    log('Player '+socket.player.name+' created');
    
    // Send players & bots to new player
    socket.emit('initia', socket.player);
    socket.emit('players', game.players.concat(game.bots));
    
    // Broadcast new player to all players
    socket.broadcast.emit('players', game.players.concat(game.bots));
    
  });
  
  // Prisonner updated position
  socket.on('player', function(pos) {
    
    // Prevent player from exiting map
    if (pos.x >= 0 && pos.x <= game.map.width && pos.y >= 0 && pos.y <= game.map.height) {
      socket.player.x = pos.x;
      socket.player.y = pos.y;
      socket.broadcast.emit('player', socket.player);
      log('Player '+socket.player.id+' moved to '+socket.player.x+','+socket.player.y);
      return;
    }
    
    log('Player '+socket.player.id+' tried to exit map: '+socket.player.x+','+socket.player.y);
    
  });
  
  // Prisonner moving
  socket.on('move', function(dir) {
    
    if (dir == "up" && socket.player.y > 0) {
      socket.player.y -= 10;
    } else if (dir == "down" && socket.player.y < game.map.height) {
      socket.player.y += 10;
    } else if (dir == "left" && socket.player.x > 0) {
      socket.player.x -= 10;
    } else if (dir == "right" && socket.player.x < game.map.width) {
      socket.player.x += 10;
    }
    
    socket.broadcast.emit('player', socket.player);
    
    log('Player '+socket.player.id+' moved '+dir+' ('+socket.player.x+','+socket.player.y+')');
  });
  
  // Watchtower moving
  socket.on('position', function(pos) {
    
    if (pos.x >= 0 && pos.x <= game.map.width && pos.y >= 0 && pos.y <= game.map.height) {
      socket.player.x = pos.x;
      socket.player.y = pos.y;
    }
    
    socket.broadcast.emit('player', socket.player);
    
    log('Player '+socket.player.id+' moved to '+pos.x+','+pos.y);
    
  });
  
  // When player disconnect
  socket.on('disconnect', function() {
    
    // Remove player from array
    var index = game.players.indexOf(socket.player);
    if (index > -1) {
      game.players.splice(index, 1);
      
      // Broadcast updated list
      socket.broadcast.emit('players', game.players.concat(game.bots));
      
      log('Player '+socket.player.id+' disconnected');
    }
  });
  
});

http.listen(app.get('port'), function(){
  log('Server listening on *:'+app.get('port'));
});
