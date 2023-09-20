import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UsersModel from "../models/Users.js";
import ReviewsModel from "../models/Reviews.js";
import dotenv from "dotenv";
dotenv.config();
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
    if (user.status === "disabled") {
      return res
        .status(400)
        .json({ message: "Your account was disabled by admin!" });
    }
    // сравнение пароля и хешпароля
    const isPasswordCorrect =
      user && (await bcrypt.compare(password, user.password));
    const secret = process.env.SECRET;
    if (user && isPasswordCorrect && secret) {
      res.status(200).json({
        user: {
          _id: user._id,
          email: user.email,
          name: user.name,
          // token: jwt.sign({ id: user.id }, secret, { expiresIn: "1d" }),
          key: user.key,
          role: user.role,
          avatarUrl: user.avatarUrl,
          status: user.status,
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
    console.log("salt");
    // Salt это строка для большей защиты пароля
    const salt = await bcrypt.genSalt(10);
    console.log(salt);
    // кодирую пароль с помощью bcrypt c помощью соли
    const hashedPassword = await bcrypt.hash(password, salt);

    // сохраняю в пользователе хешированный пароль
    const newUser = await UsersModel({
      email,
      name,
      password: hashedPassword,
      key: Date.now(),
      // role: "superadmin",
      status: "active",
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
    const user = req.user;
    return res.status(200).json({ user });
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
export const deleteUser = async (req, res) => {
  try {
    const user = req.user;
    const userId = req.user.id;
    const _id = req.params.id;

    if (
      (user.role === "admin" && userId !== _id) ||
      (user.role === "superadmin" && userId !== _id)
    ) {
      const deletedUser = await UsersModel.findByIdAndDelete(_id);
      if (!deletedUser) {
        return res.status(500).json({ message: "Failed to delete user" });
      }
      return res.status(200).json({ message: "User successfully deleted" });
    } else {
      res.status(403).json({ message: "Unauthorized to delete user" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error in deleteUser" });
  }
};

export const handleRoleUser = async (req, res) => {
  try {
    const user = req.user;
    const userId = req.user.id;
    const _id = req.params.id;
    const findUser = await UsersModel.findById(_id);
    const newRole = findUser.role === "user" ? "admin" : "user";
    console.log(findUser, "findUser", findUser.role, "role", newRole);
    if (!findUser) {
      return res
        .status(404)
        .json({ message: "dont find user! (handleRoleUser)" });
    }
    if (
      (user.role === "admin" && userId !== _id) ||
      (user.role === "superadmin" && userId !== _id)
    ) {
      if (findUser.role === "user" || findUser.role === "admin") {
        findUser.role = newRole;
      }
      await findUser.save();
      res.status(200).json({ message: "User role is succesfully updated" });
    } else {
      res.status(401).json({ message: "not authorised!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error in handleRole" });
  }
};

export const handleStatusUser = async (req, res) => {
  try {
    const user = req.user;
    const userId = req.user.id;
    const _id = req.params.id;
    const findUser = await UsersModel.findById(_id);
    const newStatus = findUser.status === "active" ? "disabled" : "active";
    if (!findUser) {
      return res
        .status(404)
        .json({ message: "dont find user! (handleStatusUser)" });
    }
    if (
      (user.role === "admin" && userId !== _id) ||
      (user.role === "superadmin" && userId !== _id)
    ) {
      if (findUser.role === "user") {
        findUser.status = newStatus;
      }
      await findUser.save();
      res.status(200).json({ message: "User status is succesfully updated" });
    } else {
      res.status(401).json({ message: "not authorised!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error in handleStatusUser" });
  }
};
export const getOneUserReviews = async (req, res) => {
  try {
    const user = req.user;
    const userId = req.user.id; // admin data
    if (user.role === "user") {
      return res.status(404).json({
        message: "dont authorised for this operation! (getOneUserReviews)",
      });
    }
    const _id = req.params.id; // user data
    const findUser = await UsersModel.findById(_id);
    console.log(findUser, "findUser", findUser.role, "role");
    if (!findUser) {
      return res
        .status(404)
        .json({ message: "dont find user! (getOneUserReviews)" });
    }
    if (findUser.role === "superadmin") {
      return res.status(404).json({
        message: "dont authorised for this operation! (getOneUserReviews)",
      });
    }
    const findUserName = findUser.name;
    const findUserRole = findUser.role;
    const oneUserReviews = await ReviewsModel.find({ userId: _id });
    res.status(200).send({ oneUserReviews, findUserName, findUserRole });
  } catch (error) {
    res.status(500).json({ message: "Error in getOneUserReviews" });
  }
};

/**
 * @route POST /api/users/google
 * @desс Регистрация
 * @access Public
 */

export const signUpGoogle = async (req, res) => {
  try {
    const { email, id, picture, verified_email, name } = req.body;

    if (!email || !id || !name) {
      return res
        .status(400)
        .json({ message: "Something is wrong with the request data" });
    }

    if (verified_email === false) {
      return res.status(400).json({ message: "Unverified email" });
    }

    const existingUser = await UsersModel.findOne({ email });

    if (existingUser?.status === "disabled") {
      return res.status(401).json({ message: "user Disabled" });
    }
    if (existingUser) {
      // Если пользователь существует, проверьте пароль
      const isPasswordValid = await bcrypt.compare(id, existingUser.password);

      if (isPasswordValid) {
        // Пароль совпадает, создайте и отправьте токен
        const token = jwt.sign({ id: existingUser.id }, process.env.SECRET, {
          expiresIn: "1d",
        });
        res.status(200).json({
          user: {
            _id: existingUser._id,
            email: existingUser.email,
            name: existingUser.name,
            key: existingUser.key,
            role: existingUser.role,
            avatarUrl: existingUser.avatarUrl,
          },
          token,
        });
      } else {
        // Пароль не совпадает
        return res.status(401).json({ message: "Incorrect password" });
      }
    } else {
      // Пользователь не существует, создайте его
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(id, salt);

      const newUser = await UsersModel({
        email,
        name,
        password: hashedPassword,
        key: Date.now(),
        role: "user",
        avatarUrl: picture,
      });

      const user = await newUser.save();

      if (user) {
        const token = jwt.sign({ id: user.id }, process.env.SECRET, {
          expiresIn: "1d",
        });
        res.status(201).json({
          user: {
            _id: user._id,
            email: user.email,
            name: user.name,
            key: user.key,
            role: user.role,
            avatarUrl: user.avatarUrl,
          },
          token,
        });
      } else {
        return res.status(400).json({ message: "Failed to create the user" });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error in sign up Google" });
  }
};
// export const signUpGoogle = async (req, res) => {
//   try {
//     const { email, id, picture, verified_email, name } = req.body;

//     if (!email || !id || !name) {
//       return res
//         .status(400)
//         .json({ message: "Something is wrong with the request data" });
//     }

//     if (verified_email === false) {
//       return res.status(400).json({ message: "Unverified email" });
//     }

//     const existingUser = await UsersModel.findOne({ email });
//     if (existingUser?.status === "disabled") {
//       return res.status(401).json({ message: "user Disabled" });
//     }
//     if (existingUser) {
//       // Если пользователь существует, проверьте пароль
//       const isPasswordValid = await bcrypt.compare(id, existingUser.password);

//       console.log(existingUser, "ex User");
//       if (isPasswordValid) {
//         // Пароль совпадает, создайте и отправьте токен
//         const token = jwt.sign({ id: existingUser.id }, process.env.SECRET, {
//           expiresIn: "1d",
//         });
//         res.status(200).json({
//           user: {
//             _id: existingUser._id,
//             email: existingUser.email,
//             name: existingUser.name,
//             key: existingUser.key,
//             role: existingUser.role,
//             status: existingUser.status,
//             avatarUrl: existingUser.avatarUrl,
//           },
//           token,
//         });
//       } else {
//         // Пароль не совпадает
//         return res.status(401).json({ message: "Incorrect password" });
//       }
//     } else {
//       // Пользователь не существует, создайте его
//       const salt = await bcrypt.genSalt(10);
//       const hashedPassword = await bcrypt.hash(id, salt);

//       const newUser = await UsersModel({
//         email,
//         name,
//         password: hashedPassword,
//         key: Date.now(),
//         role: "user",
//         status: "active",
//         avatarUrl: picture,
//       });

//       const user = await newUser.save();

//       if (user) {
//         const token = jwt.sign({ id: user.id }, process.env.SECRET, {
//           expiresIn: "1d",
//         });
//         res.status(201).json({
//           user: {
//             _id: user._id,
//             email: user.email,
//             name: user.name,
//             key: user.key,
//             role: user.role,
//             avatarUrl: user.avatarUrl,
//             status: user.status,
//           },
//           token,
//         });
//       } else {
//         return res.status(400).json({ message: "Failed to create the user" });
//       }
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error in sign up Google" });
//   }
// };
