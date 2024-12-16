const express = require("express");

const {
  getUsers,
  getUserByUsername,
} = require("../controllers/user-controller");

const userRouter = express.Router();

userRouter.get("/", getUsers);
userRouter.get("/:username", getUserByUsername);

module.exports = userRouter;
