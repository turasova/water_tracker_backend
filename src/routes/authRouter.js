import express from "express";

const authRouter = express.Router();

authRouter.post("/signup");

authRouter.post("/signin");

authRouter.post("/logout");

authRouter.post("/reset-password");

export default authRouter;
