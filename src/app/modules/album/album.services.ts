import httpStatus from "http-status";
import AppError from "../../utils/AppError";
import { TAlbum } from "./album.interface";
import { Album } from "./album.model";
import { Artist } from "../artist/artist.model";

const createAlbumIntoDB = async (payload: TAlbum) => {
  const { artistId } = payload;
  const result = await Album.create(payload);

  const newAlbumId = result._id;
  await Artist.findByIdAndUpdate(
    artistId,
    { $push: { albums: newAlbumId } },
    { new: true }
  );

  return result;
};

const getAlbumFromDB = async () => {
  const albums = await Album.find().populate("artistId").populate("songs");
  if (!albums) {
    throw new AppError(httpStatus.NOT_FOUND, "albums not found!");
  }
  return albums;
};

const getSingleAlbumFromDB = async (id: string) => {
  const album = await Album.findById(id);
  if (!album) {
    throw new AppError(httpStatus.NOT_FOUND, "album not found!");
  }
  return album;
};

export const AlbumServices = {
  createAlbumIntoDB,
  getAlbumFromDB,
  getSingleAlbumFromDB,
};
