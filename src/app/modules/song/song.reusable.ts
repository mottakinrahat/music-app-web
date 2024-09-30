import { Song } from "./song.model";

const songExist = async (id: string) => {
  const song = await Song.findById(id)
    .populate("songAlbum")
    .populate("category");
  return song;
};

export const songReusable = {
  songExist,
};
