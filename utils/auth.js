import jwt from "jsonwebtoken";
import Users from "../models/Users.js";
export const auth = async (req, res, next) => {
  try {
    // отсеиваем от bearer
    let token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.SECRET);
    const user = await Users.findById(decoded.id);
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "not authorised / Auth" });
  }
};
