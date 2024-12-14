const express = require("express");

const { getUsers } = require("../controllers/user-controller");

const userRouter = express.Router();

userRouter.get("/", getUsers);

module.exports = userRouter;
