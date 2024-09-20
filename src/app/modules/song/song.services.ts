import fs from 'fs';
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
  try {
    const fileName = `${payload.songName}.mp3`;
    const filePath = `${config.uploadSongDir}/${fileName}`;

    // Check if the file exists before trying to upload
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    // Read file content
    const fileContent = fs.readFileSync(filePath);

    // Upload the song to DigitalOcean and get the link
    const songLink = await uploadFileAndGetLink(fileName, fileContent);

    // Check if upload was successful
    if (!songLink) {
      throw new Error("File upload failed.");
    }

    // Add the songLink to the payload
    payload.songLink = songLink;

    // Destructure songAlbum from payload
    const { songAlbum } = payload;

    // Create the song in the database
    const result = await Song.create(payload);

    // Add the song ID to the album's songs array
    const songId = result._id;
    await Album.findByIdAndUpdate(
      songAlbum,
      { $push: { songs: songId } },
      { new: true }
    );

    return result;
  } catch (error) {
    console.error("Error creating song in database:", error);
    throw new Error("Error creating song. Please try again.");
  }
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
