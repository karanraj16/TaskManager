import express from "express";
import { getTasks, createTask, updateTask, deleteTask } from "../controllers/taskController.js";
import {protect} from "../middleware/authMiddleware";

const router = express.Router();

router.post("/lists/:listId/tasks", protect, createTask);   
router.get("/lists/:listId/tasks", protect, getTasks);
router.put("/tasks/:id", protect, updateTask);
router.delete("/tasks/:id", protect, deleteTask);

export default router;
