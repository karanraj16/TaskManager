import express from "express";

import { createBoard ,getBoards, getBoardById, deleteBoard } from "../controllers/boardController.js";

import { protect  } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/",protect,createBoard);

router.get("/",protect,getBoards);

router.get("/:boardId",protect,getBoardById);

router.delete("/:id", protect ,deleteBoard);

export default router;


