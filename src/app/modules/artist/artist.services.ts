import httpStatus from "http-status";
import AppError from "../../utils/AppError";
import { TArtist } from "./artist.interface";
import { Artist } from "./artist.model";
import { UserArtist } from "../user-artist/user-artist.model";

const createArtistIntoDB = async (payload: TArtist) => {
  const email = payload.email;
  const existEmail = await UserArtist.findOne({ email: email });
  if (existEmail) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "this email already registered as a artist!"
    );
  }

  const result = await Artist.create(payload);
  return result;
};

const getArtistsIntoDB = async () => {
  const artists = await Artist.find().populate("albums");

  if (!artists) {
    throw new AppError(httpStatus.NOT_FOUND, "artists not found!");
  }
  return artists;
};

const updateArtistIntoDB = async (id: string, payload: Partial<TArtist>) => {
  const updatedData = await Artist.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return updatedData;
};

const deleteArtistIntoDB = async (id: string) => {
  const deleteData = await Artist.findByIdAndUpdate(id);
  return deleteData;
};

export const artistServices = {
  createArtistIntoDB,
  getArtistsIntoDB,
  updateArtistIntoDB,
  deleteArtistIntoDB,
};
