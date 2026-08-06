import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Protect routes (only logged-in users)
 export default async function Protect (req, res, next){
  console.log("protect middleware hit");

  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    console.log("token found:", token);
  }

  if (!token) {
    console.log("no token, sending 401");
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded:", decoded);

    req.user = await User.findById(decoded.id).select("-password");
    console.log("user found:", req.user?._id);

    if (!req.user) {
      console.log("no user found");
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    console.error("JWT verify error:", error.message);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};


// Optional: Only allow admin users
export const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as admin" });
  }
};


