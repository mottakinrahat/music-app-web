import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserModel } from "../../user/user.model";
import { songServices } from "./song.services";
import { Song } from "./song.model";
import mongoose from "mongoose";
import { Favourite } from "../favList/favourite.model";
import axios from "axios";

// Replace with your Audd.io API key
const AUDD_API_KEY = "53dc0bed3486ce51fdcaa7e5960e7aad";

// Function to calculate BPM using an external service
const calculateBpmFromSong = async (songLink: string): Promise<number> => {
  try {
    // Send request to Audd.io API to analyze the song
    const response = await axios.post("https://api.audd.io/", {
      api_token: AUDD_API_KEY,
      url: songLink,
      return: "tempo",
    });

    // Extract the BPM from the response data
    const bpm = response.data.result.tempo;

    // Return the BPM value or handle it if not available
    if (bpm) {
      return bpm;
    } else {
      throw new Error("BPM could not be detected");
    }
  } catch (error) {
    throw new Error("Failed to calculate BPM from the song link.");
  }
};

// Controller to create a new song
const createSong = catchAsync(async (req, res) => {
  const { songLink } = req.body as { songLink: string };

  // Calculate BPM from the song link using external service
  const bpm = await calculateBpmFromSong(songLink);

  // Prepare data to create the song with BPM
  const songData = {
    ...req.body,
    bpm, // Add the calculated BPM to the song data
  };

  // Save song data to the database
  const result = await songServices.createSongIntoDB(songData);

  // Send response back to the client
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Song is created successfully",
    data: result,
  });
});

export { createSong };

const getAllSong = catchAsync(async (req, res) => {
  const page = Number(req.query.page);
  const limit = Number(req.query.limit);
  const search = req.query.search || "";

  const searchRegExp = new RegExp(".*" + search + ".*", "i");

  const filter = {
    $or: [
      { songName: { $regex: searchRegExp } },
      { genre: { $regex: searchRegExp } },
    ],
  };

  const totalSongs = await Song.find(filter).countDocuments();

  const songs = await songServices.getSongFromDB(
    filter,
    limit,
    (page - 1) * limit
  );

  const totalPages = Math.ceil(totalSongs / limit);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Songs retrieved successfully",
    data: {
      songs: songs,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalSongs: totalSongs,
      },
    },
  });
});

const getSingleSong = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await songServices.getSingleSongFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Song is retrieved successfully",
    data: result,
  });
});

const getSongsByCategory = catchAsync(async (req, res) => {
  const { id } = req.params;

  const songs = await songServices.getSongsByCategoryFromDB(id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "songs retrived successfully",
    data: songs,
  });
});

//dynamic
// const getDurationByLyrics = catchAsync(async (req, res) => {
//   const { id } = req.params;
//   const timeQuery = req.query.time;

//   const timeToSeconds = (timeStr: string): number => {
//     const [hours, minutes, seconds] = timeStr.split(":").map(Number);
//     return hours * 3600 + minutes * 60 + seconds;
//   };

//   const searchTime =
//     typeof timeQuery === "string" ? parseFloat(timeQuery) : NaN;

//   if (isNaN(searchTime)) {
//     return res
//       .status(400)
//       .json({ message: "Invalid or missing time parameter" });
//   }

//   const song = await songServices.getSingleSongFromDB(id);

//   if (!song) {
//     sendResponse(res, {
//       success: false,
//       statusCode: 404,
//       message: "song not found",
//       data: {},
//     });
//   }

//   const lyrics = song?.lyrics || [];

//   // Find the lyric line that covers the specified time
//   const lyricLine = lyrics.find((lyric) => {
//     const lyricStart = timeToSeconds(lyric.startTime);
//     const lyricEnd = timeToSeconds(lyric.endTime);
//     return lyricStart <= searchTime && lyricEnd >= searchTime;
//   });

//   if (!lyricLine) {
//     return sendResponse(res, {
//       success: false,
//       statusCode: 404,
//       message: "No lyric found for the specified time",
//       data: {},
//     });
//   }

//   // Send the response with the found lyric line
//   return sendResponse(res, {
//     success: true,
//     statusCode: 200,
//     message: "Lyric found successfully",
//     data: lyricLine,
//   });
// });

//fixed
const getDurationByLyrics = catchAsync(async (req, res) => {
  const { id } = req.params;

  const timeToSeconds = (timeStr: string): number => {
    const [hours, minutes, seconds] = timeStr.split(":").map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  };

  const fixedRanges = [
    { start: timeToSeconds("00:00:10"), end: timeToSeconds("00:00:15") }, // First line
    { start: timeToSeconds("00:00:16"), end: timeToSeconds("00:00:20") }, // Second line
    // { start: timeToSeconds("00:00:21"), end: timeToSeconds("00:00:25") }, // 3rd line
  ];

  const song = await songServices.getSingleSongFromDB(id);

  if (!song) {
    return sendResponse(res, {
      success: false,
      statusCode: 404,
      message: "Song not found",
      data: {},
    });
  }

  const lyrics = song?.lyrics || [];

  const filteredLyrics = fixedRanges.map((range) => {
    return lyrics.find((lyric) => {
      const lyricStart = timeToSeconds(lyric.startTime);
      const lyricEnd = timeToSeconds(lyric.endTime);
      return lyricStart >= range.start && lyricEnd <= range.end;
    });
  });

  if (filteredLyrics.every((lyric) => lyric === undefined)) {
    return sendResponse(res, {
      success: false,
      statusCode: 404,
      message: "No lyrics found for the specified time ranges",
      data: {},
    });
  }

  return sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Lyrics found successfully",
    data: {
      lyrics,
      song,
    },
  });
});

const favHandler = catchAsync(async (req, res) => {
  const { id, userId } = req.params;
  const { ObjectId } = mongoose.Types;
  const userObjectId = new ObjectId(userId);

  const song = await songServices.getSingleSongFromDB(id);

  if (!song) {
    sendResponse(res, {
      success: false,
      statusCode: 404,
      message: "song not found",
      data: {},
    });
  }

  if (Array.isArray(song.favUsers)) {
    const isFavourite = song.favUsers.some((favUserId) =>
      favUserId.equals(userObjectId)
    );

    let favList = await Favourite.findOne({ userId: userObjectId });

    if (!favList) {
      favList = new Favourite({
        userId: userObjectId,
        favSongs: [],
      });
      await favList.save();
    }

    if (!isFavourite) {
      await Song.updateOne(
        { _id: id },
        {
          $addToSet: { favUsers: userObjectId },
        }
      );

      await Favourite.updateOne(
        { userId: userId },
        {
          $addToSet: { favSongs: id },
        }
      );

      sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Song added to favourites",
        data: { isFavourite: true },
      });
    } else {
      await Song.updateOne(
        { _id: id },
        {
          $pull: { favUsers: userObjectId },
        }
      );

      await Favourite.updateOne(
        { userId: userId },
        {
          $pull: { favSongs: id },
        }
      );

      sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Song removed from favourites",
        data: { isFavourite: false },
      });
    }
  } else {
    sendResponse(res, {
      success: false,
      statusCode: 500,
      message: "Unexpected error: favUsers is not an array",
      data: {},
    });
  }
});

const playListHandler = catchAsync(async (req, res) => {
  const { id, userId } = req.params;
  const { ObjectId } = mongoose.Types;
  const userObjectId = new ObjectId(userId);

  const song = await songServices.getSingleSongFromDB(id);

  if (!song) {
    sendResponse(res, {
      success: false,
      statusCode: 404,
      message: "song not found",
      data: {},
    });
  }

  if (Array.isArray(song.playListUsers)) {
    const isPlayList = song.playListUsers.some((playListUserId) =>
      playListUserId.equals(userObjectId)
    );

    if (!isPlayList) {
      await Song.updateOne(
        { _id: id },
        {
          $addToSet: { playListUsers: userObjectId },
        }
      );

      await UserModel.updateOne(
        { _id: userId },
        {
          $addToSet: { playList: id },
        }
      );

      sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Song added to play list",
        data: { isPlayList: true },
      });
    } else {
      await Song.updateOne(
        { _id: id },
        {
          $pull: { playListUsers: userObjectId },
        }
      );

      await UserModel.updateOne(
        { _id: userId },
        {
          $pull: { playList: id },
        }
      );

      sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Song removed from playList",
        data: { isPlayList: false },
      });
    }
  } else {
    sendResponse(res, {
      success: false,
      statusCode: 500,
      message: "Unexpected error: playListUsers is not an array",
      data: {},
    });
  }
});

// const downLoadAudio = catchAsync(async (req, res) => {
//   const { fileId } = req.params;
//   const objectId = new mongoose.Types.ObjectId(fileId as string);

//   // Validate user access to the file (authentication, authorization)

//   // Path to the encrypted file
//   const encryptedFilePath = path.join(
//     process.cwd(),
//     "encrypted_files",
//     `${objectId}.enc`
//   );

//   // Define the temporary path for the decrypted file
//   const decryptedFilePath = path.join(
//     "C:", // Ensure this directory exists or create it
//     "temp_files", // Ensure this directory exists or create it
//     `${objectId}.mp3`
//   );

//   // Ensure the temporary directory exists
//   const tempDir = path.dirname(decryptedFilePath);
//   if (!fs.existsSync(tempDir)) {
//     fs.mkdirSync(tempDir, { recursive: true });
//   }

//   // Encryption key and initialization vector
//   const key = Buffer.from(config.encryption_key as string, "hex");
//   const iv = Buffer.from(config.encryption_iv as string, "hex");

//   // Validate key and IV lengths
//   if (key.length !== 32) {
//     return sendResponse(res, {
//       success: false,
//       statusCode: 500,
//       message: "Invalid Encryption Key",
//       data: "Encryption key must be 32 bytes long.",
//     });
//   }
//   if (iv.length !== 16) {
//     return sendResponse(res, {
//       success: false,
//       statusCode: 500,
//       message: "Invalid Initialization Vector",
//       data: "IV must be 16 bytes long.",
//     });
//   }

//   // Decrypt the file
//   const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
//   const input = fs.createReadStream(encryptedFilePath);
//   const output = fs.createWriteStream(decryptedFilePath);

//   input.pipe(decipher).pipe(output);

//   output.on("finish", () => {
//     // After the file is decrypted and saved, send the file to the client
//     res.setHeader(
//       "Content-Disposition",
//       `attachment; filename="${objectId}.mp3"`
//     );
//     res.setHeader("Content-Type", "audio/mpeg");
//     const decryptedStream = fs.createReadStream(decryptedFilePath);
//     decryptedStream.pipe(res);

//     // Clean up the temporary file after sending
//     decryptedStream.on("end", () => {
//       fs.unlinkSync(decryptedFilePath); // Remove the file after sending
//     });
//   });

//   sendResponse(res, {
//     success: true,
//     statusCode: 200,
//     message: "success",
//     data: "success",
//   });

//   output.on("error", (err) => {
//     sendResponse(res, {
//       success: false,
//       statusCode: 500,
//       message: "Internal Server Error",
//       data: err,
//     });
//   });
// });

export const songController = {
  createSong,
  getAllSong,
  getSingleSong,
  getSongsByCategory,
  getDurationByLyrics,
  favHandler,
  playListHandler,
};
