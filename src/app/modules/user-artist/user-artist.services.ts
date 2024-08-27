import { Types } from "mongoose";
import { UserArtist } from "./user-artist.model";

interface Info {
  userId: Types.ObjectId;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  userRef: any;
  email: string;
}

const createUserArtistIntoDB = async (payload: Info) => {
  const result = await UserArtist.create(payload);
  return result;
};

const getUserArtistIntoDB = async () => {
  const email = "ruhulamin.et15@gmail.com";
  const result = await UserArtist.findOne({ email: email }).populate("userId");
  return result;
};

export const userArtistService = {
  createUserArtistIntoDB,
  getUserArtistIntoDB,
};
