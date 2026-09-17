import express from "express";
import { upload } from "../middleware/upload.js";
import { WasteController } from "../controllers/waste.controller.js";

const router = express.Router();

router.post("/waste/analyze", upload.single("image"), WasteController.analyze);

export default router;
