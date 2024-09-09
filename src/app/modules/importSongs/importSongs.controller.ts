/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "fs";
import config from "../../config";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import path from "path";
import { ImportSong } from "./importSongs.model";

const importSongsDir = path.resolve(config.importSongsDir);

const importSongs = catchAsync(async (req, res) => {
  const file: any = req.file;
  const { userId } = req.params;

  const newSong = {
    songName: file.filename,
    songLink: `http://localhost:5000/api/v1/importSongs/${file.filename}`,
    userId: userId,
  };

  const importedSong = await ImportSong.create(newSong);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "song uploaded successfully",
    data: importedSong,
  });
});

const getImportSongsByUserId = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const songs = await ImportSong.find({ userId }).populate({
    path: "userId",
    select: "-password",
  });
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Imported Songs retrieved successfully by user id",
    data: songs,
  });
});

// const getAllImportedSongs = catchAsync(async (req, res) => {
//   fs.readdir(importSongsDir, (err, files) => {
//     if (err) {
//       return sendResponse(res, {
//         success: false,
//         statusCode: 500,
//         message: "Failed to read directory",
//         data: null,
//       });
//     }

//     const songs = files
//       .filter((file) => fs.statSync(path.join(importSongsDir, file)).isFile())
//       .map((file) => ({
//         filename: file,
//         url: `http://localhost:5000/api/v1/importSongs/${file}`, // Adjust URL based on your routing
//       }));

//     sendResponse(res, {
//       success: true,
//       statusCode: 200,
//       message: "Songs retrieved successfully",
//       data: songs,
//     });
//   });
// });


//all songs streaming working for this controller
const streamSong = catchAsync(async (req, res) => {
  const { fileName } = req.params;
  const filePath = path.join(importSongsDir, fileName);

  if (fs.existsSync(filePath)) {
    const stat = fs.statSync(filePath);
    res.writeHead(200, {
      "Content-Type": "audio/mpeg",
      "Content-Length": stat.size,
    });

    const readStream = fs.createReadStream(filePath);
    readStream.pipe(res);
  } else {
    console.log("streaming error");
  }
});

export const importSongsController = {
  importSongs,
  // getAllImportedSongs,
  streamSong,
  getImportSongsByUserId,
};
