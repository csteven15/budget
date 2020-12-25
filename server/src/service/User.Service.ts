import { Request, Response } from "express";
import User from "../models/User.Model";

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
      const user = await User.create(newUser);
      UtilsService.logInfoAndSend201(res, user.toJSON());
    } catch (error) {
      UtilsService.logErrorAndSend500(res, `Encountered an internal error when creating a test user`);
    }
  },
  getUsers: async (req: Request, res: Response) => {
    console.log("get /user");

    try {
      const users = await User.find({});
      UtilsService.logInfoAndSend200(res, users);
    } catch (error) {
      UtilsService.logErrorAndSend500(res, `Encountered an internal error when getting users`);
    }
  },
  getUserByID: async (req: Request, res: Response) => {
    console.log("get /user/:id");

    const id = req.params.id;

    try {
      const user = await User.findById({ _id: id });
      UtilsService.logInfoAndSend200(res, user?.toJSON());
    } catch (error) {
      UtilsService.logErrorAndSend500(res, `Encountered an internal error when getting a user with ID ${id}`);
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
      const user = await User.create(newUser);
      UtilsService.logInfoAndSend201(res, `Created user with id: ${user.id}`);
    } catch (error) {
      UtilsService.logErrorAndSend500(res, `Encountered an internal error when creating a user`);
    }
  },
  updateUser: async (req: Request, res: Response) => {
    console.log("put /user/:id");

    const id = req.params.id;

    try {
      const updatedUser = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      };
      await User.updateOne({ $and: [{ id: id }, { email: updatedUser.email }] }, updatedUser);
      UtilsService.logInfoAndSend200(res, `Updated user with id: ${id}`);
    } catch (error) {
      UtilsService.logErrorAndSend500(res, `Encountered an internal error when updating a user`);
    }
  }
};

export default UserService;
