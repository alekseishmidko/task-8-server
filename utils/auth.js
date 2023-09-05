import jwt from "jsonwebtoken";
import Users from "../models/Users.js";
export const auth = async (req, res, next) => {
  try {
    // отсеиваем от bearer

    let token = req.headers.authorization?.split(" ")[1];
    // let token = req.headers.authorization;
    // console.log(token, "token");
    const decoded = jwt.verify(token, process.env.SECRET);
    const user = await Users.findById(decoded.id);
    // console.log(user, "user");
    req.user = user; // передаю юзера дальше, потом можно Id вытащить например

    next();
  } catch (error) {
    res.status(401).json({ message: "not authorised / Auth" });
  }
};
