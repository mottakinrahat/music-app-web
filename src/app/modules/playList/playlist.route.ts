import express from "express";
import { playlistValidation } from "./playlist.validation";
import validateRequest from "../../middleware/validateRequest";
import { playListController } from "./playlist.controller";

const router = express.Router();

router.post(
  "/:userId",
  validateRequest(playlistValidation.playlistValidationSchema),
  playListController.createPlaylist
);
router.get("/:userId", playListController.getPlayListByUser);
router.put("/:id/:userId/:playlistid", playListController.playlistHandler);

export const playlistRoutes = router;
