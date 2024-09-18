import httpStatus from "http-status";
import AppError from "../../utils/AppError";
import { TImportSongs } from "./importSongs.interface";
import { ImportSong } from "./importSongs.model";

const createImportSong = async (payload: TImportSongs) => {
  const isExistSong = await ImportSong.findOne({ songName: payload.songName });

  if (isExistSong) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "this song already added in your device!"
    );
  }
  const result = await ImportSong.create(payload);
  return result;
};

export const importSongService = {
  createImportSong,
};
