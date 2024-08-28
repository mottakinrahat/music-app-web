import express from "express";
import validateRequest from "../../middleware/validateRequest";
import { authController } from "./auth.controller";
import { AuthValidation } from "./auth.validation";

const router = express.Router();
router.post(
  "/login",
  validateRequest(AuthValidation.loginValidationSchema),
  authController.loginUser
);
router.post("/forget-password", authController.forgetPassword);
router.put("/reset-password/:token", authController.resetPassword);

export const AuthRoutes = router;
