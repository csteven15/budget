import express from "express";
import UserService from "../service/User.Service";

const router = express.Router();

// test route
router.get("/user/test/:id", UserService.testUser);

// get all users
router.get("/users", UserService.getUsers);

// get user by id
router.get("/user/:id", UserService.getUserByID);

// add new user
router.post("/user", UserService.addUser);

// update user
router.put("/user/:id", UserService.updateUser);

// delete all users
router.delete("/users", UserService.deleteAllUser);

export default router;