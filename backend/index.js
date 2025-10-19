const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/database");
const authRoutes = require("./routes/auth");
const capsuleRoutes = require("./routes/capsule");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/capsules", capsuleRoutes);
app.get("/", (req, res) => {
  res.json({ message: "Chrono Nest API is running!" });
});

app.listen(PORT, () => {
  console.log(`Chrono Nest server running on port: ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});
