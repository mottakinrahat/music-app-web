import { UserService } from "../../user/user.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { artistServices } from "../artist/artist.services";
import { userArtistService } from "./user-artist.services";

const createUserArtist = catchAsync(async (req, res) => {
  const { role } = req.params;
  const { email } = req.body;
  let createdEntity;
  let userRef;

  if (role === "artist") {
    createdEntity = await artistServices.createArtistIntoDB(req.body);
    userRef = "Artist";
    await userArtistService.createUserArtistIntoDB({
      userId: createdEntity._id,
      userRef,
      email,
    });
    sendResponse(res, {
      success: true,
      statusCode: 201,
      message: `${role} created successfully`,
      data: createdEntity,
    });
  } else if (role === "user") {
    createdEntity = await UserService.createUserIntoDB(req.body);
    userRef = "User";
    await userArtistService.createUserArtistIntoDB({
      userId: createdEntity._id,
      userRef,
      email,
    });
    sendResponse(res, {
      success: true,
      statusCode: 201,
      message: `${role} created successfully`,
      data: createdEntity,
    });
  }
});

const getUserArtist = catchAsync(async (req, res) => {
  const result = await userArtistService.getUserArtistIntoDB();
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "user artist successfully retrived",
    data: result?.userId,
  });
});

export const UserArtistController = {
  createUserArtist,
  getUserArtist,
};
