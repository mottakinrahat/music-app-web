import { UserArtist } from "./user-artist.model";

const createUserArtistIntoDB = async (id: string) => {
  const result = await UserArtist.create(id);
  return result;
};

export const userArtistService = {
  createUserArtistIntoDB,
};
