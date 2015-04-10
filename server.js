var express = require('express');
var app = express();
var http = require('http').Server(app);

// app.get('/', function(req, res){
//   res.send('<h1>Hello world</h1>');
// });

app.use(express.static('public'))

http.listen(3000, function(){
  console.log('listening on *:3000');
});
