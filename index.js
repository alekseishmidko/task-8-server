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
import { handleError } from "./utils/errors.js";

const app = express();
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

mongoose
  .connect(process.env.MONGO_DB_URL)
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

app.use(handleError);

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
  // console.log(`A user connected ${socket.id}`);

  socket.on("comment", (data) => {
    // console.log("comment data:", data);
    io.emit("responce", data);
  });
  socket.on("disconnect", () => {
    // console.log("A user disconnected");
  });
});
