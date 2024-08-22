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
    statusCode: 200,
    success: true,
    message: "Albums are retrieved successfully",
    data: results,
  });
});

const getSingleAlbum = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AlbumServices.getSingleAlbumFromDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Album retrieved successfully",
    data: result,
  });
});

export const albumController = {
  createAlbum,
  getAllAlbum,
  getSingleAlbum,
};
