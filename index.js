import express from "express";
import dotenv from "dotenv";

import mongoose from "mongoose";
import cors from "cors";
import { usersRouter } from "./routes/usersRouter.js";
import { productsRouter } from "./routes/productsRouter.js";
import { reviewsRouter } from "./routes/reviewsRouter.js";
import { likesRouter } from "./routes/likesRouter.js";
import { uploadRouter } from "./routes/uploadRouter.js";
import { commentsRouter } from "./routes/commentRouter.js";
import http from "http";
import { Server } from "socket.io"; // Импортируем Server из socket.io
import * as socketIO from "socket.io";
import { searchRouter } from "./routes/searchRouter.js";
const app = express();
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

mongoose
  .connect(
    "mongodb+srv://alex:1234@cluster0.gle9jsl.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("DB is active!");
  })
  .catch((error) => {
    console.log(error, "DB error");
  });

app.use("/api/users/", usersRouter);
app.use("/api/products/", productsRouter);
app.use("/api/reviews/", reviewsRouter);
app.use("/api/likes/", likesRouter);
app.use("/api/upload/", uploadRouter);
app.use("/api/comments/", commentsRouter);
app.use("/api/search/", searchRouter);
// socket
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST, PATCH,DELETE,UPLOAD"],
  },
});

server.listen(3001, (error) => {
  if (error) console.log(error, "err");
  else {
    console.log("3001 is running");
  }
});
// Обработка событий Socket.IO
io.on("connection", (socket) => {
  console.log(`A user connected ${socket.id}`);

  socket.on("comment", (data) => {
    console.log("comment data:", data);
    io.emit("responce", data);
  });
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// github
// const githubConfig = {
//   clientID: "ac99e8446355ba05f5ae",
//   clientSecret: "b15cfbcc84cf740db46afac7bfa16e19ff655ee2",
//   callbackURL: "YOUR_CALLBACK_URL",
// };
// // Используйте GitHubStrategy для аутентификации через GitHub
// passport.use(
//   new GitHubStrategy(
//     githubConfig,
//     (accessToken, refreshToken, profile, done) => {
//       // Здесь вы можете сохранить профиль пользователя или выполнить другие действия с данными пользователя
//       return done(null, profile);
//     }
//   )
// );

// // Используйте Passport.js для управления сеансами и аутентификацией
// passport.serializeUser((user, done) => {
//   done(null, user);
// });

// passport.deserializeUser((user, done) => {
//   done(null, user);
// });

// // Используйте Express.js с Passport.js
// app.use(passport.initialize());
// app.use(passport.session());

// // Роут для инициирования аутентификации
// app.get("/auth/github", passport.authenticate("github"));

// // Роут обратного вызова после аутентификации на GitHub
// app.get(
//   "/auth/github/callback",
//   passport.authenticate("github", { failureRedirect: "/" }),
//   (req, res) => {
//     // Если аутентификация успешна, вы можете перенаправить пользователя или выполнить другие действия
//     res.redirect("/dashboard");
//   }
// );

// // Роут для выхода
// app.get("/logout", (req, res) => {
//   req.logout();
//   res.redirect("/");
// });

// // Защищенный роут - проверка аутентификации пользователя
// app.get("/dashboard", (req, res) => {
//   if (req.isAuthenticated()) {
//     res.send("Добро пожаловать на вашу панель управления.");
//   } else {
//     res.redirect("/");
//   }
// });
