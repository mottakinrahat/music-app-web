import httpStatus from "http-status";
import AppError from "../../utils/AppError";
import { Favourite } from "./favourite.model";

const getSingleFavUserFromDB = async (id: string) => {
  const favUser = await Favourite.findOne({ userId: id }).populate("favSongs");
  if (!favUser) {
    throw new AppError(httpStatus.NOT_FOUND, "favourite user not found!");
  }
  return favUser;
};

export const FavoriteServices = {
  getSingleFavUserFromDB,
};
