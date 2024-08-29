import httpStatus from "http-status";
import catchAsync from "../utils/catchAsync";
import sendResponse from "../utils/sendResponse";
import { UserService } from "./user.service";

// login user
const loginUser = catchAsync(async (req, res) => {
  const result = await UserService.loginUser(req.body);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "User login successfully",
    data: result,
  });
});

const getUsers = catchAsync(async (req, res) => {
  const users = await UserService.getUsersFromDB();
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "users return successfully",
    data: users,
  });
});

// chang user password
const changePassword = catchAsync(async (req, res) => {
  try {
    const { ...passwordData } = req.body;

    const result = await UserService.changePasswordIntoDB(
      req?.user,
      passwordData
    );

    sendResponse(res, {
      success: true,
      statusCode: 201,
      message: "Password changed successfully",
      data: result,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    sendResponse(res, {
      success: false,
      statusCode: 400,
      message: error.message,
      data: null,
    });
  }
});

const getSingleUser = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const user = await UserService.getSingleUserIntoDB(userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "user return successfully",
    data: user,
  });
});

export const UserControllers = {
  loginUser,
  changePassword,
  getSingleUser,
  getUsers,
};
