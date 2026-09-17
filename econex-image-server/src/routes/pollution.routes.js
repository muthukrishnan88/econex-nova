import express from "express";
import { upload } from "../middleware/upload.js";
import { PollutionController } from "../controllers/pollution.controller.js";

const router = express.Router();

router.post("/pollution/analyze", upload.single("image"), PollutionController.analyze);

export default router;
