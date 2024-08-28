import httpStatus from "http-status";
import config from "../../config";
import catchAsync from "../../utils/catchAsync";
import { createJSONWebToken } from "../../utils/createToken";
import { emailWithNodeMail } from "../../utils/email";
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

  const user = await AuthServices.forgetPasswordFromDB(email);

  //send email
  const token = createJSONWebToken(
    { email },
    config.forget_password_key as string,
    "10m"
  );

  //prepare email
  const emailData = {
    email,
    subject: "Reset password",
    html: `
      <h2>Hello ${user.firstName + "" + user.lastName}</h2>
      <p>Please click here to link <a href="${
        config.clientUrl
      }/reset-password/${token}" target="_blank">reset your password</a></p>
      `,
  };

  //send email with nodemailer
  try {
    await emailWithNodeMail(emailData);
    return sendResponse(res, {
      success: true,
      statusCode: 200,
      message: `Please check your email (${email}) to reset your password`,
      data: token,
    });
  } catch (error) {
    return sendResponse(res, {
      success: false,
      statusCode: 500,
      message: "An error occurred while processing your request",
      data: error,
    });
  }
});

const resetPassword = catchAsync(async (req, res) => {
  const { newPassword } = req.body;
  const { token } = req.params;

  const sendData = {newPassword, token}

  const result = await AuthServices.resetPasswordFromDB(sendData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User new password reset successfully done",
    data: result,
  });
});
export const authController = {
  loginUser,
  forgetPassword,
  resetPassword,
};
