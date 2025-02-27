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

const app = express();

// Middleware
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(bodyParser.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/symptoms", symptomRoutes);
app.use("/api/mechanics", mechanicRoutes);

// Sync database
sequelize.sync().then(() => {
  console.log("Database synced");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
