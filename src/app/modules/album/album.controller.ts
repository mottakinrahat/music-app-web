import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AlbumServices } from "./album.services";
import { Artist } from "../artist/artist.model";

const createAlbum = catchAsync(async (req, res) => {
  const { artistId } = req.body;
  const result = await AlbumServices.createAlbumIntoDB(req.body);

  const newAlbumId = result._id;

  await Artist.findByIdAndUpdate(
    artistId,
    { $push: { albums: newAlbumId } },
    { new: true }
  );

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Album is created successfully",
    data: result,
  });
});

const getAllAlbum = catchAsync(async (req, res) => {
  const results = await AlbumServices.getAlbumFromDB();
  sendResponse(res, {
    statusCode: results ? 200 : 404,
    success: results ? true : false,
    message: results ? "Albums are retrieved successfully" : "Albums not found",
    data: results ? results : [],
  });
});

const getSingleAlbum = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AlbumServices.getSingleAlbumFromDB(id);
  sendResponse(res, {
    statusCode: result ? 200 : 404,
    success: result ? true : false,
    message: result ? "album is retrieved successfully" : "album not found",
    data: result ? result : {},
  });
});

export const albumController = {
  createAlbum,
  getAllAlbum,
  getSingleAlbum,
};
