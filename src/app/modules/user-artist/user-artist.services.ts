import { Types } from "mongoose";
import { UserArtist } from "./user-artist.model";

interface Info {
  firstName: string;
  lastName: string;
  userId: Types.ObjectId;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  userRef: any;
  email: string;
  password: string;
  role: string;
}

const createUserArtistIntoDB = async (payload: Info) => {
  const result = await UserArtist.create(payload);
  return result;
};

export const userArtistService = {
  createUserArtistIntoDB,
};
