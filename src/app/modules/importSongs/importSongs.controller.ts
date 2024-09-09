/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "fs";
import config from "../../config";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import path from "path";

const importSongsDir = path.resolve(config.importSongsDir);

const importSongs = catchAsync(async (req, res) => {
  const file: any = req.file;
  const { userId } = req.params;

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "song uploaded successfully",
    data: {
      filename: file.filename,
      originalname: file.originalname,
      userId: userId,
    },
  });
});

// Controller function to get all imported songs
const getAllImportedSongs = catchAsync(async (req, res) => {
  fs.readdir(importSongsDir, (err, files) => {
    if (err) {
      return sendResponse(res, {
        success: false,
        statusCode: 500,
        message: "Failed to read directory",
        data: null,
      });
    }

    const songs = files
      .filter((file) => fs.statSync(path.join(importSongsDir, file)).isFile())
      .map((file) => ({
        filename: file,
        url: `http://localhost:5000/api/v1/importSongs/${file}`, // Adjust URL based on your routing
      }));

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Songs retrieved successfully",
      data: songs,
    });
  });
});


export const importSongsController = {
  importSongs,
  getAllImportedSongs,
};
