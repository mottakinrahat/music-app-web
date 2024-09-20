import express from "express";
import { songController } from "./song.controller";
const router = express.Router();

router.post("/", songController.createSong);
router.get("/", songController.getAllSong);
router.get("/:id", songController.getSingleSong);
router.get("/category/:id", songController.getSongsByCategory);
router.get("/:id/:time", songController.getDurationByLyrics);
router.put("/fav-list/:id/:userId", songController.favHandler);
router.put("/play-list/:id/:userId", songController.playListHandler);
// router.get("/download-audio/:fileId", songController.downLoadAudio);
export const songRoutes = router;
