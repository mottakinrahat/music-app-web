import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUser(req.body);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "User logged in successfully",
    data: result,
  });
});

const forgetPassword = catchAsync(async (req, res) => {
  const { email } = req.body;

  await AuthServices.forgetPasswordFromDB(email);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: `Please check your email (${email}) to reset your password`,
    data: "",
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const { newPassword } = req.body;
  const { token } = req.params;

  const sendData = { newPassword, token };

  await AuthServices.resetPasswordFromDB(sendData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User new password reset successfully done",
    data: "",
  });
});
export const authController = {
  loginUser,
  forgetPassword,
  resetPassword,
};
