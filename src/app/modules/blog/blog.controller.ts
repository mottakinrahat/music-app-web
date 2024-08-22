import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { blogService } from "./blog.services";

const createBlog = catchAsync(async (req, res) => {
  const result = await blogService.createBlogIntoDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "blog created successfully",
    data: result,
  });
});

const getBlogs = catchAsync(async (req, res) => {
  const blogs = await blogService.getBlogsIntoDB();

  sendResponse(res, {
    success: blogs ? true : false,
    statusCode: blogs ? 200 : 404,
    message: blogs ? "blogs retrived successfully" : "blogs not found",
    data: blogs ? blogs : [],
  });
});

const getSingleBlog = catchAsync(async (req, res) => {
  const { id } = req.params;
  const blog = await blogService.getSingleBlogIntoDB(id);

  sendResponse(res, {
    success: blog ? true : false,
    statusCode: blog ? 200 : 404,
    message: blog ? "blog retrived successfully" : "blog not found",
    data: blog ? blog : {},
  });
});

const updateBlog = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const updatedBlog = await blogService.updateBlogIntoDB(id, updateData);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "blog updated successfully",
    data: updatedBlog,
  });
});

const deletedBlog = catchAsync(async (req, res) => {
  const { id } = req.params;
  const deletedBlog = await blogService.deleteBlogIntoDB(id);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "blog deleted successfully",
    data: deletedBlog,
  });
});

export const blogController = {
  createBlog,
  getBlogs,
  updateBlog,
  getSingleBlog,
  deletedBlog,
};
