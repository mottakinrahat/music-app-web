import mongoose from "mongoose";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { PlayListServices } from "./playlist.services";
import httpStatus from "http-status";
import { songServices } from "../song/song.services";
import { Playlist } from "./playlist.model";
import { Song } from "../song/song.model";

const createPlaylist = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const data = req.body;
  const { ObjectId } = mongoose.Types;

  const playlistData = {
    ...data,
    userId: new ObjectId(userId),
  };

  const result = await PlayListServices.createPlayListIntoDB(playlistData);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Play list is created successfully",
    data: result,
  });
});

const getPlayListSongs = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const playListUser = await PlayListServices.getPlayListUserFromDB(userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Play list songs retrived successfully",
    data: playListUser.playListSongs,
  });
});

const playlistHandler = catchAsync(async (req, res) => {
  const { id, userId } = req.params;

  const { ObjectId } = mongoose.Types;
  const userObjectId = new ObjectId(userId);

  const song = await songServices.getSingleSongFromDB(id);

  if (!song) {
    return sendResponse(res, {
      success: false,
      statusCode: 404,
      message: "Song not found",
      data: {},
    });
  }

  const playList = await PlayListServices.getPlayListUserFromDB(userId);

  const playListId = playList._id;
  
  if (Array.isArray(song.playListUsers)) {
    const isPlayList = song.playListUsers.some((playlistUserId) =>
      playlistUserId.equals(userObjectId)
    );

    if (!isPlayList) {
      await Song.updateOne(
        { _id: id },
        { $addToSet: { playListUsers: userObjectId } }
      );


      await Playlist.updateOne(
        { _id: playListId },
        { $addToSet: { playListSongs: id } }
      );

      return sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Song added to playlist",
        data: { isPlayList: true },
      });
    } else {
      await Song.updateOne(
        { _id: id },
        { $pull: { playListUsers: userObjectId } }
      );

      await Playlist.updateOne(
        { userId: userObjectId },
        { $pull: { playListSongs: id } }
      );

      return sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Song removed from playlist",
        data: { isPlayList: false },
      });
    }
  } else {
    return sendResponse(res, {
      success: false,
      statusCode: 500,
      message: "Unexpected error: playListUsers is not an array",
      data: {},
    });
  }
});

export const playListController = {
  createPlaylist,
  getPlayListSongs,
  playlistHandler,
};
