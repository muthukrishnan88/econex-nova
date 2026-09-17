import express from "express";
import { LinkController } from "../controllers/link.controller.js";

const router = express.Router();

router.post("/link/analyze", LinkController.analyze);

export default router;
