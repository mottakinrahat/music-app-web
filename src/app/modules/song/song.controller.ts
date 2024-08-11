import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { songServices } from "./song.services";

const createSong = catchAsync(async (req, res) => {
  const result = await songServices.createSongIntoDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Song is created successfully",
    data: result,
  });
});
const getAllSong = catchAsync(async (req, res) => {
  const result = await songServices.getSongFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Event items retrieved successfully",
    data: result,
  });
});
const getSingleSong = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await songServices.getSingleSongFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Song is retrieved successfully",
    data: result,
  });
});
export const songController = {
  createSong,
  getAllSong,
  getSingleSong,
};
