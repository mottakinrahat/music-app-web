import httpStatus from "http-status";
import AppError from "../../utils/AppError";
import { TPlaylist } from "./playlist.interface";
import { Playlist } from "./playlist.model";

const createPlayListIntoDB = async (payload: TPlaylist) => {
  const result = await Playlist.create(payload);
  return result;
};

const getPlayListByUserFromDB = async (id: string) => {
  const playListByUser = await Playlist.find({ userId: id }).populate(
    "playListSongs"
  );
  if (!playListByUser) {
    throw new AppError(httpStatus.NOT_FOUND, "play list user not found!");
  }
  return playListByUser;
};

const getAllPlayListIntoDB = async () => {
  const result = await Playlist.find({}).populate("playListSongs");
  // const allPlayListSongs = result.flatMap((playlist) => playlist.playListSongs);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Play list not found");
  }
  return result;
};

export const PlayListServices = {
  createPlayListIntoDB,
  getPlayListByUserFromDB,
  getAllPlayListIntoDB,
};
