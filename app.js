 
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , app = express()
  , io = null
  , server = null
app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);

server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

io = require('socket.io').listen(server)

var players = {
    left : null
    , right : null
}

io.sockets.on('connection', function (socket){
    if(players.left===null){
        players.left = socket
        socket.emit('player-set','left')
        socket.on('step',function(data){
            if(players.right)
                players.right.emit('step',data)
        })
    }else if(players.right===null){
        players.right = socket
        socket.emit('player-set','right')
        socket.on('step',function(data){
            if(players.left)
                players.left.emit('step',data)
        })
    }else socket.emit('player-set','full')
    socket.on('disconnect',function(){
        console.log('on player disconnect')
        if(socket===players.left){
            io.sockets.emit('player-leave','left')
            players.left = null
        }if(socket===players.right){
            io.sockets.emit('player-leave','right')
            players.right = null
        }
    })
});