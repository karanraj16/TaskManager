const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const boardRoutes = require("./routes/boardRoutes");
const listRoutes = require("./routes/listRoutes");
const userRoute = require("./routes/userRoute");
const taskRoutes = require("./routes/taskRoutes");
const errorHandler = require("./middleware/errorMiddleware");
const path = require("path");

dotenv.config();
const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/boards", boardRoutes);
app.use("/api", listRoutes);
app.use("/api", taskRoutes);
app.use("/api/users",userRoute);

if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname,"frontend", "build")));

  app.use( (req, res) =>
    res.sendFile(path.resolve(__dirname, "../frontend/build" , "index.html"))
  );
};

// Global error handler
app.use(errorHandler);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.log(err));
