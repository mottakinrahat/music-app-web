import httpStatus from "http-status";
import AppError from "../../utils/AppError";
import { TPlaylist } from "./playlist.interface";
import { Playlist } from "./playlist.model";

const createPlayListIntoDB = async (payload: TPlaylist) => {
  const result = await Playlist.create(payload);
  return result;
};

const getPlayListByUserFromDB = async (id: string) => {
  const playListUser = await Playlist.find({ userId: id });
  const playListbyUser = playListUser;
  if (!playListbyUser) {
    throw new AppError(httpStatus.NOT_FOUND, "play list user user not found!");
  }
  return playListbyUser;
};

export const PlayListServices = {
  createPlayListIntoDB,
  getPlayListByUserFromDB,
};
