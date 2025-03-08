const { Server } = require("socket.io");

let adminSocketIds = [];

function initializeSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("admin-login", () => {
      console.log(`Admin logged in: ${socket.id}`);
      adminSocketIds.push(socket.id);
    });

    socket.on("admin-logout", () => {
      console.log(`Admin logged out: ${socket.id}`);
      adminSocketIds = adminSocketIds.filter((id) => id !== socket.id);
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
      adminSocketIds = adminSocketIds.filter((id) => id !== socket.id);
    });
  });

  return { io, adminSocketIds };
}

module.exports = initializeSocket;
