var express=require('express');
var app=express();
var server=require('http').createServer(app);
var io=require('socket.io').listen(server);

var users=[];
var connections= [];
var userid=[];

//server.listen(3000);
server.listen(process.env.PORT || 3000);
console.log('Server running');

app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html');
});

io.sockets.on('connection',function(socket){

    connections.push(socket);
    userid.push(socket.id);
    console.log(userid);
     
    console.log('Connected Count: '+ connections.length);
 
     updateUsernames();
    
    //Disconnect
    socket.on('disconnect',function(data){
        //users
        io.sockets.emit('msg-disconnect',{msg:socket.username});
        users.splice(users.indexOf(socket.username),1);
        updateUsernames();
        //connections
    connections.splice(connections.indexOf(socket),1);
    userid.splice(connections.indexOf(socket),1);
    console.log(userid);
    console.log('Ayrıldınız ,Bagli :'+connections.length); 
   });

     //Message
    socket.on('send-message', function(data){      
    io.sockets.emit('new-message',{msg:data,user: socket.username}); 
    
    
    });
    socket.on('special-send-message',function(data){ 
        io.to(data.usersocket).emit('special-new-message',{msg: data.msg,user: socket.username});
      
    })
    socket.on('new-user',function(data, callback){
        callback(true);
        socket.username=data;
        users.push(socket.username);  
        io.sockets.emit('new-join',{user:data});
        updateUsernames();
    });
    
    function updateUsernames(){
        io.sockets.emit('get-users',users,users.length,userid);
    }
});

 