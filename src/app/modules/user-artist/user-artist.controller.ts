import { UserService } from "../../user/user.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { artistServices } from "../artist/artist.services";
import { userArtistService } from "./user-artist.services";

const createUserArtist = catchAsync(async (req, res) => {
  const { role } = req.params;
  if (role === "artist") {
    const createdArtist = await artistServices.createArtistIntoDB(req.body);

    await userArtistService.createUserArtistIntoDB(
      createdArtist._id.toString()
    );

    sendResponse(res, {
      success: true,
      statusCode: 201,
      message: "aritst created successfully",
      data: createdArtist,
    });
  } else if (role === "user") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const createdUser: any = await UserService.createUserIntoDB(req.body);

    await userArtistService.createUserArtistIntoDB(createdUser._id.toString());

    sendResponse(res, {
      success: true,
      statusCode: 201,
      message: "aritst created successfully",
      data: createdUser,
    });
  }
});

export const UserArtistController = {
  createUserArtist,
};
