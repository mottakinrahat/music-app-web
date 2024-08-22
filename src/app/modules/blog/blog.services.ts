import httpStatus from "http-status";
import { TBlog } from "./blog.interface";
import { BLog } from "./blog.model";
import AppError from "../../utils/AppError";

const createBlogIntoDB = async (payload: TBlog) => {
  const result = await BLog.create(payload);
  return result;
};

const getBlogsIntoDB = async () => {
  const blogs = await BLog.find().populate("blogWriter");
  if (!blogs) {
    throw new AppError(httpStatus.NOT_FOUND, "blogs not found!");
  }
  return blogs;
};

const getSingleBlogIntoDB = async (id: string) => {
  const blog = await BLog.findById(id);
  if (!blog) {
    throw new AppError(httpStatus.NOT_FOUND, "blog not found!");
  }
  return blog;
};

const updateBlogIntoDB = async (id: string, payload: Partial<TBlog>) => {
  const updatedData = await BLog.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return updatedData;
};

const deleteBlogIntoDB = async (id: string) => {
  const result = await BLog.findByIdAndDelete(id);
  return result;
};

export const blogService = {
  createBlogIntoDB,
  getBlogsIntoDB,
  updateBlogIntoDB,
  getSingleBlogIntoDB,
  deleteBlogIntoDB,
};
