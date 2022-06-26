const { Server } = require("socket.io");

const io = new Server({
  cors: {
    origin: "*",
    method: ["GET", "POST"],
  },
});

// //Knex
// const knexConfig = require("./knexfile");
// const knex = require("knex")(knexConfig[development]);

io.on("connection", (socket) => {
  console.log(`Socket with id ${socket.id} is now connected.`);

  socket.on("send-message", (data) => {
    console.log(`${socket.id} has sent a message ${data}.`);
    socket.broadcast.emit("send-message", data);
  });
});

io.listen(4000);
