import express from "express";
import UserService from "../service/User.Service";

const router = express.Router();

// test route
router.get("/user/test/:userId", UserService.testUser);

// get all users
router.get("/user", UserService.getUsers);

// get user by id
router.get("/user/:userId", UserService.getUserByID);

// add new user
router.post("/user", UserService.addUser);

// update user
router.put("/user/:userId", UserService.updateUser);

// delete all users
router.delete("/user", UserService.deleteAllUser);

export default router;