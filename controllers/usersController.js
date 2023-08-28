import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UsersModel from "../models/Users.js";

// * @route POST /api/users/login
// * @desс Логин
// * @access Public
// */
export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "enter all forms" });
    }
    const user = await UsersModel.findOne({ email });

    // сравнение пароля и хешпароля
    const isPasswordCorrect =
      user && (await bcrypt.compare(password, user.password));
    const secret = process.env.SECRET;
    if (user && isPasswordCorrect && secret) {
      res.status(200).json({
        user: {
          // user,
          email: user.email,
          name: user.name,
          // token: jwt.sign({ id: user.id }, secret, { expiresIn: "1d" }),
          key: user.key,
          role: user.role,
          avatarUrl: user.avatarUrl,
        },
        token: jwt.sign({ id: user.id }, secret, { expiresIn: "1d" }),
      });
    } else {
      return res
        .status(400)
        .json({ message: "uncorrect login or password (signIn)" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error in signIn" });
  }
};

/**
 * @route POST /api/users/register
 * @desс Регистрация
 * @access Public
 */
export const signUp = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: "enter all forms" });
    }
    const registeredUser = await UsersModel.findOne({ email });
    if (registeredUser) {
      return res
        .status(400)
        .json({ message: "email is exiting yet!(sign Up)" });
    }

    // Salt это строка для большей защиты пароля
    const salt = await bcrypt.genSalt(10);

    // кодирую пароль с помощью bcrypt c помощью соли
    const hashedPassword = await bcrypt.hash(password, salt);

    // сохраняю в пользователе хешированный пароль
    const newUser = await UsersModel({
      email,
      name,
      password: hashedPassword,
      key: Date.now(),
      // role: "superadmin",
      role: "user",
      avatarUrl: req.body.avatarUrl,
    });

    const user = await newUser.save();

    const secret = process.env.SECRET;
    if (user && secret) {
      res.json({
        user,
        token: jwt.sign({ id: user.id }, secret, { expiresIn: "1d" }),
      });
    } else {
      return res
        .status(400)
        .json({ message: "failed to create user(sign up)" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error in sign up" });
  }
};

/**
 *
 * @route GET /api/users/current
 * @desc Текущий пользователь
 * @access Private
 */
export const current = async (req, res) => {
  try {
    // console.log(req.user._id, "userId");
    return res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({ message: "Error in current" });
  }
};
/**
 *
 * @route GET /api/users/all
 * @desc Текущий пользователь
 * @access Private
 */
export const getAllUsers = async (req, res) => {
  try {
    const user = req.user;
    if (user.role === "admin" || user.role === "superadmin") {
      const allUsers = await UsersModel.find().exec();
      res.status(200).send({ allUsers });
    } else {
      res.status(404).json({ message: "not authorised" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error in getAllUsers" });
  }
};
