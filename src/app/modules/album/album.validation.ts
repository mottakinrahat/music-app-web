import { z } from "zod";

const albumValidationSchema = z.object({
  albumName: z.string().min(1, "album name is required"),
  albumImage: z.string().min(1, "album image is required"),
  genre: z.string().min(1, "genre is required"),
});

export const albumValidation = {
  albumValidationSchema,
};
