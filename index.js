const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const cors =require("cors");

const {getGame, createGame, deleteGame, joinGame, getRoom} = require("./games.js")
 
const PORT = 3001;

app.use(cors());

io.on('connection', function (socket) {
  socket.on("createGame", () => {
      createGame(socket.id);
    })    
  

  socket.on("joinGame", id => {
    const game =getGame(id);
    if (game && socket.id !== game.host){     
      joinGame(id, socket.id)
      socket.join(id);
      io.to(id).emit("startGame");
    } else {
      socket.emit("invsalid input");      
    }
  }) 
  
  socket.on("update", data => {
    const room = getRoom(socket.rooms, socket.id);
    socket.to(room).emit("update", data);
  })

  socket.on("I won", (data) => {
    const room = getRoom(socket.rooms, socket.id);
    socket.to(room).emit("opponent won", data);
  })

  socket.on("play again", () => {
    const room = getRoom(socket.rooms, socket.id);
    socket.to(room).emit("play again");
  })

  socket.on("opponent left", () => {
    const room = getRoom(socket.rooms, socket.id);
    socket.to(room).emit("opponent left");
    deleteGame(socket.id);
  })

  socket.on("disconnect", () => {
    if (getGame(socket.id)){
      io.in(getGame(socket.id).host).emit("opponent left");
      deleteGame(socket.id);
    }
  })
});


server.listen(process.env.PORT || 5000, () => console.log(`listening on ${PORT}`));