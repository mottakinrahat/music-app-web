import express from "express";
import { UserControllers } from "./user.controller";
import validateRequest from "../middleware/validateRequest";

import auth from "../middleware/auth";
import { UserValidation } from "./user.validation";
import { AuthValidation } from "../modules/auth/auth.validation";

const router = express.Router();

// login user
router.post(
  "/login",
  validateRequest(AuthValidation.loginValidationSchema),
  UserControllers.loginUser
);

// change user password
//TODO: validate auth()
router.post(
  "/change-password",
  auth("user"),
  validateRequest(UserValidation.changePasswordValidationSchema),
  UserControllers.changePassword
);

router.get("/", UserControllers.getUsers);
router.get("/:userId", UserControllers.getSingleUser);

export const UserRoutes = router;
