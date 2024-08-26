import mongoose from "mongoose";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { FavoriteServices } from "./favourite.services";
import { songServices } from "../song/song.services";
import { Favourite } from "./favourite.model";
import { Song } from "../song/song.model";

const getFavouriteSongs = catchAsync(async (req, res) => {
  const { id } = req.params;
  const user = await FavoriteServices.getSingleFavUserFromDB(id);

  const favSongs = user.favSongs;

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "favourite songs retrieved successfully",
    data: favSongs,
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

export const favouriteController = {
  getFavouriteSongs,
  favHandler,
};
