import { Request, Response } from "express";
import UserModel from "../models/User.Model";

import UtilsService from "./Utils.Service";

const UserService = {
  testUser: async (req: Request, res: Response) => {
    console.log("get /user/test/:id");

    const newUser = {
      name: `Test ${req.params.id}`,
      email: `Test${req.params.id}@mail.com`,
      password: `password`
    };

    try {
      const user = await UserModel.create(newUser);
      UtilsService.logInfoAndSend201(res, user.toJSON());
    } catch (error) {
      UtilsService.logErrorAndSend500(res, `Encountered an internal error when creating a test user: ${error}`);
    }
  },
  getUsers: async (req: Request, res: Response) => {
    console.log("get /user");

    try {
      const users = await UserModel.find({});
      UtilsService.logInfoAndSend200(res, users);
    } catch (error) {
      UtilsService.logErrorAndSend500(res, `Encountered an internal error when getting users: ${error}`);
    }
  },
  getUserByID: async (req: Request, res: Response) => {
    console.log("get /user/:id");

    const id = req.params.id;

    try {
      const user = await UserModel.findById({ _id: id });
      UtilsService.logInfoAndSend200(res, user?.toJSON());
    } catch (error) {
      UtilsService.logErrorAndSend500(res, `Encountered an internal error when getting a user with ID ${id}: ${error}`);
    }
  },
  addUser: async (req: Request, res: Response) => {
    console.log("post /user");

    const newUser = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    };

    try {
      const user = await UserModel.create(newUser);
      UtilsService.logInfoAndSend201(res, `Created user with id: ${user.id}`);
    } catch (error) {
      UtilsService.logErrorAndSend500(res, `Encountered an internal error when creating a user: ${error}`);
    }
  },
  updateUser: async (req: Request, res: Response) => {
    console.log("put /user/:id");

    const id = req.params.id;

    const validUser = await UtilsService.validId(res, "User", id);
    if (!validUser) return;

    try {
      const updatedUser = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      };
      await UserModel.updateOne({ _id: id }, updatedUser, { runValidators: true });
      UtilsService.logInfoAndSend200(res, `Updated user with id: ${id}`);
    } catch (error) {
      UtilsService.logErrorAndSend500(res, `Encountered an internal error when updating a user: ${error}`);
    }
  }
};

export default UserService;
