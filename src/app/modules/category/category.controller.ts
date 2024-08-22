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
  const results = await categoryServices.getCategoriesIntoDB();

  sendResponse(res, {
    success: results ? true : false,
    statusCode: results ? 200 : 404,
    message: results
      ? "Categories retrived successfully"
      : "categories not found",
    data: results ? results : [],
  });
});

const updateCategory = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const updatedData = await categoryServices.updateCategoryIntoDB(
    id,
    updateData
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Category updated successfully",
    data: updatedData,
  });
});

const deleteCategory = catchAsync(async (req, res) => {
  const { id } = req.params;

  const deletedData = await categoryServices.deleteCategoryIntoDB(id);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Category deleted successfully",
    data: deletedData,
  });
});

export const categoryController = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};
