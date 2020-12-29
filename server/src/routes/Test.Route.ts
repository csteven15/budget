import express from "express";
import TestService from "../service/Test.Service";

const router = express.Router();

// test hello world
router.get("/test", TestService.hello);

// delete collections
router.delete("/test/drop", TestService.deleteCollections);

export default router;