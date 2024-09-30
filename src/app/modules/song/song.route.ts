import express from "express";
import { songController } from "./song.controller";
import { uploadSong } from "../../middleware/uploadSongs";
const router = express.Router();

router.post("/", uploadSong.single("songLink"), songController.createSong);
router.get("/", songController.getAllSong);
router.get("/:id", songController.getSingleSong);
router.get("/category/:id", songController.getSongsByCategory);
router.get("/:id/:time", songController.getDurationByLyrics);
router.put("/fav-list/:id/:userId", songController.favHandler);
router.put("/play-list/:id/:userId", songController.playListHandler);
router.put("/:id", songController.updateSong);
router.delete("/:id", songController.deleteSong);
// router.get("/download-audio/:fileId", songController.downLoadAudio);
export const songRoutes = router;
