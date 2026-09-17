import express from "express";
import { upload } from "../middleware/upload.js";
import { DisasterController } from "../controllers/disaster.controller.js";

const router = express.Router();

router.post("/disaster/analyze", upload.single("image"), DisasterController.analyze);

export default router;
