import express from "express";
import validateRequest from "../../middleware/validateRequest";
import { categoryValidation } from "./category.validation";
import { categoryController } from "./category.controller";
const router = express.Router();

router.post(
  "/",
  validateRequest(categoryValidation.categoryValidationSchema),
  categoryController.createCategory
);

router.get("/", categoryController.getCategories);

export const categoryRoutes = router;
