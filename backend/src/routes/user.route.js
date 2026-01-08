import express from "express";
import * as userController from "../controllers/user.controller.js";
import { authTokenCurrent } from "../middlewares/authToken.js";

const route = express.Router();

route.route("/token").post(userController.token);
route.route("/register").post(userController.registerUser);
route.route("/login").post(userController.logInUser);
route.route("/current").get(authTokenCurrent, userController.current);
route.route("/data").get(userController.usersData);
route.route("/usersToken").get(userController.usersToken);
route.route("/:id").delete(userController.deleteToken);

export default route;
