const { Server } = require("socket.io");
const { createServer } = require("http");

const { Socket } = require("dgram");
const { join } = require("path");

async function getAllRooms() {
  const result = await knex("room").select();
  return result;
}

async function getSingleRooms(id) {
  const foundRoom = await knex("rooms").select().where({ id: id });
  return foundRoom;
}

async function createRoom(room) {
  const id = await knex("room").insert(room);
  return id;
}

async function getAllMessages(room) {
  const result = await knex("messages").select().where({ room: room });
  return result;
}

async function addMessage({ user, room, message }) {
  if (message) {
    const id = await knex("messages").insert({ user, room, message });
    return id;
  } else {
    return null;
  }
}

async function getMessage(id) {
  const newMessage = await knex("messages").select().where({ id: id });
  return newMessage;
}

async function deleteRoom(room) {
  await knex("room").where({ room: room }).del();
}

const io = new Server({
  cors: {
    origin: "*",
    method: ["GET", "POST"],
  },
});

// //Knex
const knex = require("./data/knexfile");

const initialState = [];

const rooms = ["test room 1", "test room 2"];
const users = [];

io.on("connection", (socket) => {
  console.log(`Socket with id ${socket.id} is now connected.`);
  // const id = socket.handshake.query.id;
  socket.join("default");

  // Create user
  socket.on("create_user", (user) => {
    users.push(user);
    console.log(user);
    socket.emit("user_created", user);
  });

  // Create rooms
  socket.on("create_room", (room) => {
    // room är en sträng
    rooms.push(room);
    console.log(rooms);

    socket.emit("room_created", room);
  });

  // Join room
  socket.on("join_room", (room) => {
    // room är en sträng
    socket.join(room);

    socket.to(room).emit("room_joined");

    console.log(socket.rooms);
  });

  // Leave room
  socket.on("leave_room", (data) => {
    console.log(`${socket.id} has left room ${data}.`);

    socket.leave(data);

    console.log(socket.rooms);
  });

  //Erase room -- EJ KLAR
  socket.on("delete_room", (data) => {});

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
