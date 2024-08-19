import { TCategory } from "./category.interface";
import { Category } from "./category.model";

const createCategoryIntoDB = async (payload: TCategory) => {
  const result = await Category.create(payload);
  return result;
};

const getCategoriesIntoDB = async () => {
  const result = await Category.find();
  return result;
};

export const categoryServices = {
  createCategoryIntoDB,
  getCategoriesIntoDB,
};
