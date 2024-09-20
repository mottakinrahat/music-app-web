import multer from "multer";
import path from "path";
import config from "../config";

// Ensure that the importSongsDir is defined and valid
if (!config.uploadSongDir) {
  throw new Error("Import songs directory is not configured.");
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(config.uploadSongDir)); // Ensure it's an absolute path
  },
  filename: function (req, file, cb) {
    const sanitizedFilename = path.basename(file.originalname); // Ensure it's safe to use
    cb(null, `${sanitizedFilename}`);
  },
});

// Multer upload configuration with file filter for validation
export const uploadSong = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedFileTypes = /audio\/(mpeg|mp3|wav|ogg|aac)/;
    if (allowedFileTypes.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only audio files are allowed."));
    }
  },
  limits: { fileSize: 64 * 1024 * 1024 }, // 20 MB file size limit
});
