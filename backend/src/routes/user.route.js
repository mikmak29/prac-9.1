import express from "express";
import * as userController from "../controllers/user.controller.js";
import { authToken } from "../middlewares/authToken.js";

const route = express.Router();

route.route("/token").post(userController.token);
route.route("/register").post(userController.registerUser);
route.route("/login").post(userController.logInUser);
route.route("/current").get(authToken, userController.current);

export default route;
