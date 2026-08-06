import express from "express";
import {  body, validationResult  } from "express-validator";
import {  register, login  } from "../controllers/authController.js";

const router = express.Router();

const handleValidationError = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("Validation errors:", errors.array()); // 👈 Add this
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.post(
  "/register",
  [
    body("username").notEmpty().withMessage("username is required"),
    body("email").isEmail().withMessage("Please include a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Please enter a password with 6 or more characters"),
  ],
  handleValidationError,
  register
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please include a valid email"),
    body("password").exists().withMessage("Password is required"),
  ],
  handleValidationError,
  login
);

export default router;
