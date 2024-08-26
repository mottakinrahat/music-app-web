import httpStatus from "http-status";
import AppError from "../../utils/AppError";
import { TPlaylist } from "./playlist.interface";
import { Playlist } from "./playlist.model";

const createPlayListIntoDB = async (payload: TPlaylist) => {
  const result = await Playlist.create(payload);
  return result;
};

const getPlayListUserFromDB = async (id: string) => {
  const playListUser = await Playlist.findOne({ userId: id }).populate(
    "playListSongs"
  );
  if (!playListUser) {
    throw new AppError(httpStatus.NOT_FOUND, "play list songs not found!");
  }
  return playListUser;
};

export const PlayListServices = {
  createPlayListIntoDB,
  getPlayListUserFromDB,
};
