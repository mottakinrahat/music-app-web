import { UserService } from "../../user/user.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { artistServices } from "../artist/artist.services";
import { userArtistService } from "./user-artist.services";

const createUserArtist = catchAsync(async (req, res) => {
  const { role } = req.params;
  const { firstName, lastName, email, password } = req.body;
  let createdEntity;
  let userRef;

  if (role === "artist") {
    createdEntity = await artistServices.createArtistIntoDB(req.body);
    userRef = "Artist";
  } else if (role === "user") {
    createdEntity = await UserService.createUserIntoDB(req.body);
    userRef = "User";
  }

  if (createdEntity) {
    // Pass both userId and userRef to the userArtistService
    await userArtistService.createUserArtistIntoDB({
      firstName,
      lastName,
      userId: createdEntity._id,
      userRef,
      email,
      password,
      role,
    });

    sendResponse(res, {
      success: true,
      statusCode: 201,
      message: `${role} created successfully`,
      data: createdEntity,
    });
  } else {
    sendResponse(res, {
      success: false,
      statusCode: 400,
      message: "Invalid role specified",
      data: {},
    });
  }
});

export const UserArtistController = {
  createUserArtist,
};
