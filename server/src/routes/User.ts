import express, { Request, Response, NextFunction } from "express";
import User, { IUser } from "../models/User";

const router = express.Router();


// helper functions
// validate a user
const validateUser = async (req: Request, res: Response, user: IUser) => {
  try {
    await user.validate();
  } catch (error) {
    res.status(500).send("Invalid user fields");
  }
};

// test route
router.get("/test-user", async (req: Request, res: Response) => {
  console.log("post /test-user");
  try {
    const user = await User.create({
      name: `Test ${Math.random()}`,
      email: `Test${Math.random()}@mail.com`
    });
    await user.save();
    console.log("created user");
    res.status(200).send(user.toJSON());

  } catch (error) {
    throw error;
  }
})

// get all users
router.get("/users", async (req: Request, res: Response) => {
  console.log("get /user");

  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (error) {
    throw error;
  }
})

// get user by id
router.get("/user/:id", async (req: Request, res: Response) => {
  console.log("get /user/:id");

  const id = req.params.id;

  try {
    const user = await User.findById(id);
    res.status(200).send(user?.toJSON());
  } catch (error) {
    res.status(500).send(`Encountered an internal error when creating a user with ID ${id}`);
  }
})

// add new user
router.post("/user", async (req: Request, res: Response) => {
  console.log("post /user")  

  try { 
    const user = await User.create({
      name: req.body.name,
      email: req.body.email
    });

    await user.save();
    res.status(201).send(`Created user with id: ${user.id}`);
  } catch (error) {
    res.status(500).send("Encountered an internal error when creating a user");
  }
})

// update user
router.put("/user/:id", async (req: Request, res: Response) => {
  console.log("put /user/:id")

  const id = req.params.id;

  console.log("body: ", req.body);
  
  try {
    const updatedUser = new User({
      name: req.body.name,
      email: req.body.email
    });

    validateUser(req, res, updatedUser);

    await User.updateOne({id}, updatedUser);
    res.status(201).send(`Updated user with id: ${id}`);
  } catch (error) {
    res.status(500).send("Encountered an internal error when updating a user");
  }
})


export default router;