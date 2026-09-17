import express from "express";
import { upload } from "../middleware/upload.js";
import { ImageController } from "../controllers/image.controller.js";

const router = express.Router();

router.post("/image/verify", upload.single("image"), ImageController.verify);

export default router;
