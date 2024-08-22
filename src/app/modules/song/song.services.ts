import httpStatus from "http-status";
import AppError from "../../utils/AppError";
import { TSong } from "./song.interface";
import { Song } from "./song.model";
import { FilterQuery } from "mongoose";

export interface ISong extends Document {
  songName: string;
  genre: string;
}

const createSongIntoDB = async (payload: TSong) => {
  const result = await Song.create(payload);
  return result;
};

const getSongFromDB = async (payload: FilterQuery<Partial<ISong>>) => {
  const results = await Song.find(payload)
    .populate("songAlbum")
    .populate("category");
  if (!results) {
    throw new AppError(httpStatus.NOT_FOUND, "songs not found!");
  }

  return results;
};

const getSingleSongFromDB = async (id: string) => {
  const result = await Song.findById(id)
    .populate("songAlbum")
    .populate("category");
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "song not found!");
  }
  return result;
};

const getSongsByCategoryFromDB = async (id: string) => {
  const songs = await Song.find({ category: id })
    .populate("songAlbum")
    .populate("category");
  if (!songs) {
    throw new AppError(httpStatus.NOT_FOUND, "songs not found!");
  }
  return songs;
};

const updateSongIntoDB = async (id: string, payload: Partial<TSong>) => {
  const updatedData = await Song.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return updatedData;
};

export const songServices = {
  createSongIntoDB,
  getSongFromDB,
  getSingleSongFromDB,
  getSongsByCategoryFromDB,
  updateSongIntoDB,
};
