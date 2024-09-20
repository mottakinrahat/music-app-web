import httpStatus from "http-status";
import AppError from "../../utils/AppError";
import { TSong } from "./song.interface";
import { Song } from "./song.model";
import { FilterQuery } from "mongoose";
import { Album } from "../album/album.model";
import uploadFileAndGetLink from "../../middleware/fileUpload";
import config from "../../config";

export interface ISong extends Document {
  songName: string;
  genre: string;
}

const createSongIntoDB = async (payload: TSong) => {
  const fileName = `${payload.songName}.mp3`;
  const songLink = await uploadFileAndGetLink(config.uploadSongDir, fileName);

  // Add the songLink to the payload
  payload.songLink = songLink;
  const { songAlbum } = payload;

  // Create the song in the database
  const result = await Song.create(payload);

  // Add the song to the album
  const songId = result._id;
  await Album.findByIdAndUpdate(
    songAlbum,
    { $push: { songs: songId } },
    { new: true }
  );
  return result;
};

const getSongFromDB = async (
  filter: FilterQuery<Partial<ISong>>,
  limit: number,
  skip: number
) => {
  const results = await Song.find(filter)
    .populate({
      path: "songAlbum",
      populate: {
        path: "artistId",
        select: "-password",
      },
    })
    .populate("category")
    .limit(limit)
    .skip(skip);

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
