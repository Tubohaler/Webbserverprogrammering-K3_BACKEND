const express = require("express");
const cors = require("cors");
const app = express();

// //Knex
const knex = require("./data/database");
const { argv } = require("process");

const fs = require("fs");

const { Server } = require("socket.io");
const http = require("http");
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    method: ["GET", "POST", "DELETE"],
  },
});

app.use(cors());

async function getAllRooms() {
  const result = await knex("rooms").select();
  return result;
}

async function getSingleRoom(id) {
  const foundRoom = await knex("rooms").select().where({ id: id });
  return foundRoom;
}

async function createRoom(room) {
  const id = await knex("rooms").insert(users, rooms, messages);
  return id;
}

async function getAllMessages(room) {
  const result = await knex("messages").select().where({ room_id: room });
  return result;
}

async function addMessage({ user_id, room_id, message }) {
  const id = await knex("messages").insert({ user_id, room_id, message });
  return id;
}

async function addRooms(room_name) {
  const rooms = await knex("rooms").insert({ name: room_name });
  return rooms;
}

async function getMessage(id) {
  const newMessage = await knex("messages").select().where({ id: id });
  return newMessage;
}

async function deleteRoom(room_name) {
  await knex("rooms").where("name", room_name).del();

  await knex("messages").where("room_id", room_name).del();
}

const initialState = [];

const users = [];

io.on("connection", (socket) => {
  console.log(`Socket with id ${socket.id} is now connected.`);
  socket.join("default");

  //Middleware
  socket.use(([event, ...args], next) => {
    if (event === "message") {
      const data = JSON.stringify({
        user: user,
        message: args[0],
        room: room,
        timestamp: Date(),
      });

      fs.writeFile("data_log.txt", data, { flag: "a" }, (error) => {
        if (error) {
          console.log(error);
        } else {
          console.log("data skrevs till data_log.txt");
        }
      });
    }
    next();
  });

  // Create user
  socket.on("create_user", (user) => {
    socket.user = user;
    users.push(user);
    socket.emit("user_created", user);
  });

  // Create rooms
  socket.on("create_room", async (room) => {
    const rooms = await getAllRooms();
    const index = rooms.findIndex((ExistingRoom) => room === ExistingRoom.name);
    if (index === -1) {
      addRooms(room);
      socket.emit("room_created", room);
    }
  });

  // Join room
  socket.on("join_room", async (room) => {
    socket.roomName = room;
    const allMessages = await getAllMessages(room);

    socket.join(room);

    socket.emit("join_room", allMessages);

    console.log(socket.rooms, "This is socket rooms");
  });

  // Leave room
  socket.on("leave_room", (data) => {
    console.log(`${socket.id} has left room ${data}.`);

    socket.leave(data);
  });

  //Delete room
  socket.on("delete_room", async (room) => {
    await deleteRoom(room);
    const newRooms = await getAllRooms();

    socket.emit("delete_room", newRooms);
  });

  io.emit("new_user", "A new user has joined");

  // Message
  socket.on("send_message", (data) => {
    const user_id = socket.user;
    const room_id = socket.roomName;

    if (data.length !== 0) {
      addMessage({ user_id, room_id, message: data });

      socket.broadcast.emit("send_message", data);
      console.log(`${socket.id} has sent a message ${data}.`);
    }
  });

  socket.on("disconnect", (reason) =>
    console.log(`Socket ${socket.id} was disconnected. Reason: ${reason}`)
  );
  socket.on("error", (error) => {
    console.error(error, " this is io error");
  });
});

const PORT = 4000 || process.env.PORT;

server.listen(PORT, () =>
  console.log(`Server running at port http://localhost:${PORT}`)
);
