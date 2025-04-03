require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const sequelize = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const symptomRoutes = require("./routes/symptomRoutes");
const mechanicRoutes = require("./routes/mechanicRoutes");
const http = require("http");
const initializeSocket = require("./config/socket");

const app = express();

// Middleware
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(bodyParser.json());
app.use(cookieParser());

const server = http.createServer(app);

// Initialize Socket.IO
const { io, adminSocketIds } = initializeSocket(server);
app.set("io", io);
app.set("adminSocketIds", adminSocketIds);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/symptoms", symptomRoutes);
app.use("/api/mechanics", mechanicRoutes);

// Sync database
sequelize.sync({ force: false }).then(() => {
  console.log("Connected to database 🚀");
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
