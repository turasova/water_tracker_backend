import express from "express";
import {
  getCurrentUser,
  updateInfoUser,
} from "../controllers/userControllers.js";

const usersRouter = express.Router();

usersRouter.patch("/avatars");
usersRouter.get("/current", getCurrentUser);
usersRouter.patch("/", updateInfoUser);

export default usersRouter;
