import express from "express";
const router = express.Router();
import protect  from "../middleware/authMiddleware.js";
import { 
  createList,
  getLists,
  updateList,
  deleteList,
 } from "../controllers/listController.js";

// ✅ Create list under a specific board
router.post("/boards/:boardId/lists", protect, createList);

// ✅ Get all lists of a board
router.get("/boards/:boardId/lists", protect, getLists);

// ✅ Update list by ID
router.put("/lists/:id", protect, updateList);

// ✅ Delete list by ID
router.delete("/lists/:id", protect, deleteList);

export default router;
