import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { artistServices } from "./artist.services";

const getAritsts = catchAsync(async (req, res) => {
  const artists = await artistServices.getArtistsIntoDB();

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "artists retrived successfully",
    data: artists,
  });
});

const updateArtist = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const updatedArtist = await artistServices.updateArtistIntoDB(id, updateData);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "artist updated successfully",
    data: updatedArtist,
  });
});

const deletedArtist = catchAsync(async (req, res) => {
  const { id } = req.params;
  const deletedAritst = await artistServices.deleteArtistIntoDB(id);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "artist deleted successfully",
    data: deletedAritst,
  });
});

export const artistController = {
  getAritsts,
  updateArtist,
  deletedArtist,
};
