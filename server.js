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

const initialState = [];

const rooms = [{ name: "Default room", state: initialState }];

io.on("connection", (socket) => {
  console.log(`Socket with id ${socket.id} is now connected.`);
  // const id = socket.handshake.query.id;
  socket.join("default");

  // Create rooms
  socket.on("create_room", (room) => {
    rooms.push(room);
    console.log(rooms);

    io.emit();
  });

  // Join room
  socket.on("join_room", (room) => {
    const checkedInRooms = Array.from(socket.rooms);
    console.log(`${socket.id} has joined ${room}.`);
    const presentRoom = checkedInRooms[1];

    io.to(presentRoom).emit("joinded_room", socket.id);

    socket.leave();

    socket.join(room);
    io.to(room).emit("updated_state", rooms.default);
    console.log(`${socket.id} joined room: ${room}`);

    console.log(socket.rooms);
  });

  // Leave room
  socket.on("leave_room", (data) => {
    console.log(`${socket.id} has left room ${data}.`);

    socket.leave(data);

    console.log(socket.rooms);
  });

  io.emit("new_user", "A new user has joined");

  // Message
  socket.on("send-message", (data) => {
    console.log(`${socket.id} has sent a message ${data}.`);

    socket.broadcast.emit("send-message", data);
  });

  //Direkt meddelande
  socket.on("private_message", (data) => {
    socket.to(data.to).emit("send-message", data.message);
  });

  // Ta bort denna?
  socket.on("disconnect", (reason) =>
    console.log(`Socket ${socket.id} was disconnected. Reason: ${reason}`)
  );
});

io.listen(4000);
