
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/admin', function(req,res) {
	res.render('admin.ejs');
});

app.get('/team', function(req,res) {
	res.render('team.ejs');
});

var server = http.createServer(app);
server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

var RedisStore = require('socket.io/lib/stores/redis')
  , redis  = require('socket.io/node_modules/redis')
  , pub    = redis.createClient()
  , sub    = redis.createClient()
  , client = redis.createClient();

io = require('socket.io').listen(server);

io.set('store', new RedisStore({
  redisPub : pub
, redisSub : sub
, redisClient : client
}));


io.on('connection', function(socket){
	socket.on('addtask', function(data){
		io.sockets.emit('task', data.task);
	});
	
	socket.on('disconnect', function(){});
});
