import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { categoryServices } from "./category.services";

const createCategory = catchAsync(async (req, res) => {
  const result = await categoryServices.createCategoryIntoDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Category created successfully",
    data: result,
  });
});

const getCategories = catchAsync(async (req, res) => {
  const result = await categoryServices.getCategoriesIntoDB();

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Categories retrived successfully",
    data: result,
  });
});

export const categoryController = {
  createCategory,
  getCategories,
};
