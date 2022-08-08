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

//OK
async function getAllRooms() {
  const result = await knex("rooms").select();
  return result;
}

async function getSingleRoom(id) {
  const foundRoom = await knex("rooms").select().where({ id: id });
  // console.log(foundRoom);
  return foundRoom;
}

async function createRoom(room) {
  const id = await knex("rooms").insert(users, rooms, messages);
  return id;
}
//OK
async function getAllMessages(room) {
  // console.log(room);
  const result = await knex("messages").select().where({ room_id: room });
  // console.log(result);
  return result;
}
// ska ta meddelande frontend, ska lägga in den i DB, därefter hämta meddelandena o rendera ut dem igen. 1) kolla var namn 2) consolelogga allt
async function addMessage({ user_id, room_id, message }) {
  const id = await knex("messages").insert({ user_id, room_id, message });
  return id;
}
// Jag har id, user_id, room_id. Vilket ska jag använda?
async function getMessage(id) {
  const newMessage = await knex("messages").select().where({ id: id });
  return newMessage;
}

async function deleteRoom(room) {
  await knex("rooms").where({ room: room }).del();
  await knex
    .select("message", "rooms")
    .from("messages")
    .where({ room: room })
    .del();
}

const initialState = [];

const rooms = ["test room 1", "test room 2"];
const users = [];

io.on("connection", (socket) => {
  // const allRooms = getAllRooms();
  console.log(`Socket with id ${socket.id} is now connected.`);
  // const id = socket.handshake.query.id;
  socket.join("default");

  //Middleware
  socket.use(([event, ...args], next) => {
    if (event === "message") {
      // console.log(event, args);

      // data som ska skrivas till writeFile("data_log.txt")
      // username, message, room & timestamp.
      const data = JSON.stringify({
        user: user,
        message: args[0],
        room: room,
        timestamp: Date(),
      });

      // fs.WriteFile("text-fil", objektet[data], flag: a för att inte skriva över tidigare loggar som skickas, sist med error-meddelanden.)
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
    // console.log(user);
    socket.emit("user_created", user);
  });

  // Create rooms
  socket.on("create_room", (room) => {
    // room är en sträng
    // hämta alla rum, sen filter som filterar mot det rummet du joina, sen if sats, matchar det skrivna rummet med ett rum som redans finns,returnera då fel. Annars skapa rum.
    rooms.push(room);
    // console.log(rooms);

    socket.emit("room_created", room);
  });

  // Join room
  socket.on("join_room", async (room) => {
    socket.roomName = room;
    const allMessages = await getAllMessages(room);
    // console.log("room", room);
    // console.log(allMessages);
    socket.join(room);

    // socket.to(room).emit("room_joined");
    socket.emit("join_room", allMessages);

    console.log(socket.rooms, "This is socket rooms");
  });

  // Leave room
  socket.on("leave_room", (data) => {
    console.log(`${socket.id} has left room ${data}.`);

    socket.leave(data);

    console.log(socket.rooms);
  });

  //Delete room -- EJ KLAR
  socket.on("delete_room", async (room) => {
    await deleteRoom(room);
    const newRooms = await getAllRooms();

    socket.emit("delete_room", newRooms);
  });

  io.emit("new_user", "A new user has joined");

  //OK
  // Message
  socket.on("send_message", (data) => {
    console.log(`${socket.id} has sent a message ${data}.`);
    const user_id = socket.user;
    const room_id = socket.roomName;

    addMessage({ user_id, room_id, message: data });
    getAllRooms(room_id);

    socket.broadcast.emit("send_message", data);
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
