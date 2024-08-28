import bcrypt from "bcrypt";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import config from "../../config";
import { TLoginUser } from "./auth.interface";
import AppError from "../../utils/AppError";
import { UserArtist } from "../user-artist/user-artist.model";
import { createJSONWebToken } from "../../utils/createToken";
import { emailWithNodeMail } from "../../utils/email";

interface JwtPayload {
  email: string;
  iat?: number;
  exp?: number;
}

const loginUser = async (payload: TLoginUser) => {
  const { email, password } = payload;

  const user = await UserArtist.findOne({ email });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, ` User not found `);
  }

  // Compare the provided password
  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid password");
  }

  const jwtPayload = {
    _id: user.userId,
    firstName: user?.firstName,
    lastName: user?.lastName,
    email: user?.email,
    role: user?.role,
  };

  const returnUser = {
    _id: user?.userId,
    firstName: user?.firstName,
    lastName: user?.lastName,
    email: user?.email,
    role: user?.role,
  };

  // generate access token
  const token = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: config.expires_times,
  });

  return {
    user: returnUser,
    token,
  };
};

// const changePassword = async (
//   userData: JwtPayload,
//   payload: { oldPassword: string; newPassword: string }
// ) => {
//   // checking if the user is exist
//   const user = await User.isUserExistsByCustomId(userData.userId);

//   if (!user) {
//     throw new AppError(httpStatus.NOT_FOUND, "This user is not found !");
//   }
//   // checking if the user is already deleted

//   const isDeleted = user?.isDeleted;

//   if (isDeleted) {
//     throw new AppError(httpStatus.FORBIDDEN, "This user is deleted !");
//   }

//   // checking if the user is blocked

//   const userStatus = user?.status;

//   if (userStatus === "blocked") {
//     throw new AppError(httpStatus.FORBIDDEN, "This user is blocked ! !");
//   }

//   //checking if the password is correct

//   if (!(await User.isPasswordMatched(payload.oldPassword, user?.password)))
//     throw new AppError(httpStatus.FORBIDDEN, "Password do not matched");

//   //hash new password
//   const newHashedPassword = await bcrypt.hash(
//     payload.newPassword,
//     Number(config.bcrypt_salt_rounds)
//   );

//   await UserModel.findOneAndUpdate(
//     {
//       id: userData.userId,
//       role: userData.role,
//     },
//     {
//       password: newHashedPassword,
//       needsPasswordChange: false,
//       passwordChangedAt: new Date(),
//     }
//   );

//   return null;
// };

// const refreshToken = async (token: string) => {
//   // checking if the given token is valid
//   const decoded = jwt.verify(
//     token,
//     config.jwt_refresh_secret as string
//   ) as JwtPayload;

//   const { userId, iat } = decoded;

//   // checking if the user is exist
//   const user = await UserModel.isUserExistsByCustomId(userId);

//   if (!user) {
//     throw new AppError(httpStatus.NOT_FOUND, "This user is not found !");
//   }
//   // checking if the user is already deleted
//   const isDeleted = user?.isDeleted;

//   if (isDeleted) {
//     throw new AppError(httpStatus.FORBIDDEN, "This user is deleted !");
//   }

//   // checking if the user is blocked
//   const userStatus = user?.status;

//   if (userStatus === "blocked") {
//     throw new AppError(httpStatus.FORBIDDEN, "This user is blocked ! !");
//   }

//   if (
//     user.passwordChangedAt &&
//     User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat as number)
//   ) {
//     throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized !");
//   }

//   const jwtPayload = {
//     userId: user.id,
//     role: user.role,
//   };

//   const accessToken = createToken(
//     jwtPayload,
//     config.jwt_access_secret as string,
//     config.jwt_access_expires_in as string
//   );

//   return {
//     accessToken,
//   };
// };

const forgetPasswordFromDB = async (email: string) => {
  const user = await UserArtist.findOne({ email: email });
  if (!user) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `user not found with this ${email}`
    );
  }

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
    return;
  } catch (error) {
    throw new AppError(httpStatus.NOT_FOUND, `mail not send ${error}`);
  }

  return;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const resetPasswordFromDB = async (payload: any) => {
  const { token, newPassword } = payload;

  const decoded = jwt.verify(
    token,
    config.forget_password_key as string
  ) as JwtPayload;

  if (!decoded) {
    throw new AppError(httpStatus.NOT_FOUND, "token is invalid");
  }

  const findEmail = decoded.email;

  const user = await UserArtist.findOne({ email: findEmail });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "user not found");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const updates = { password: hashedPassword, new: true };

  await UserArtist.findByIdAndUpdate(user?._id, updates);
};

export const AuthServices = {
  loginUser,
  forgetPasswordFromDB,
  resetPasswordFromDB,
};
