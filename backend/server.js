import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import boardRoutes from "./routes/boardRoutes.js";
import listRoutes from "./routes/listRoutes.js";
import userRoute from "./routes/userRoute.js";
import taskRoutes from "./routes/taskRoutes.js";
import errorHandler from "./middleware/errorMiddleware.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// CORS configuration
const allowedOrigins = [
  process.env.CLIENT_URL,
  "https://task-manager-n7e8hl5hn-karan-e373.vercel.app",
  "http://localhost:3000",
  "http://localhost:5000"
];

app.use(cors({ 
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true 
}));

app.use(express.json());

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ message: "✅ Backend is running!", status: "ok" });
});

app.get("/api", (req, res) => {
  res.json({ message: "✅ API is working!", status: "ok" });
});

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/boards", boardRoutes);
app.use("/api", listRoutes);
app.use("/api", taskRoutes);
app.use("/api/users", userRoute);

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "../frontend/build", "index.html"))
  );
}

// Global error handler
app.use(errorHandler);

// MongoDB connection with better error handling
console.log("🔌 Attempting MongoDB connection...");
console.log("MONGO_URI configured:", !!process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  connectTimeoutMS: 10000,
})
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔐 Client URL: ${process.env.CLIENT_URL}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    console.error("Full error:", err);
    // Don't exit - Render will keep trying
    setTimeout(() => {
      mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log("✅ MongoDB reconnected"))
        .catch(err => console.error("❌ Reconnection failed:", err));
    }, 5000);
  });

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("🛑 Server shutting down...");
  mongoose.connection.close();
  process.exit(0);
});
