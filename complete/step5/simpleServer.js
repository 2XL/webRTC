/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/*
 * this server has two tasks
 *  to act as a message intermediary & to manage webrtc video chat rooms
 */


// var static = require('node-static')











var static = require('node-static');
var http = require('http');
var file = new(static.Server)();
var app = http.createServer(function(req, res){
    file.serve(req, res);
    
}).listen(2013);

var io = require('socket.io').listen(app);

io.sockets.on('connection', function(socket){
    
    
    
    function log(){
	var array = [">>> Message from server: "];
	for(var i = 0; i< arguments.length; i++){
	    array.push(arguments[i]);
	}
	socket.emit('log',array);
    }
    
    socket.on('message', function(message){
	log('got message:', message);
	socket.broadcast.emit('message', message);
    });
    
    
    socket.on('create or join', function(room){
	var numClients = io.sockets.clients(room).length;
        
        log('Room '+room+' has '+numClients+' clients(s)');
        log('Request to create or join room '+room);
        
        if(numClients === 0){
            socket.join(room);
            socket.emit('created', room);
        }else if(numClients === 1){
            io.sockets.in(room).emit('join', room);
            socket.join(room);
            socket.emit('joined', room);
            
        }else{
            // max client admes is 2
            socket.emit('full', room);
            
            
        }
        
        socket.emit('emit(): client' +socket.id + ' joined room ' +room);
        socket.broadcast.emit('broadcast(): client '+ socket.id +' joined room '+room);
         
        
    });
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
});



















