import express from "express";
import validateRequest from "../../middleware/validateRequest";
import { songValidation } from "./song.validation";
import { songController } from "./song.controller";
const router = express.Router();

router.post(
  "/",
  validateRequest(songValidation.songValidationSchema),
  songController.createSong
);
router.get("/", songController.getAllSong);
router.get("/:id", songController.getSingleSong);
export const songRoutes = router;