import { TSong } from "./song.interface";
import { Song } from "./song.model";

const createSongIntoDB = async (payload: TSong) => {
  const result = await Song.create(payload);

  return result;
};
const getSongFromDB = async () => {
  const result = await Song.find().populate("albumId");
  return result;
};
const getSingleSongFromDB = async (id: string) => {
  const result = await Song.findById(id);

  return result;
};

export const songServices = {
  createSongIntoDB,
  getSongFromDB,
  getSingleSongFromDB,
};
