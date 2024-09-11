import express from "express";
import { importSongsController } from "./importSongs.controller";
import { upload } from "../../middleware/importSongs";
import ensureDirectoryExists from "../../middleware/insureDirectoryExist";

const router = express.Router();

router.post(
  "/:userId",
  ensureDirectoryExists,
  upload.single("songFile"),
  importSongsController.importSongs
);

// router.get("/", importSongsController.getAllImportedSongs);
router.get("/:fileName", importSongsController.streamSong);
router.get("/mysongs/:userId", importSongsController.getImportSongsByUserId);

export const importSongsRoute = router;
