import { model, Schema } from "mongoose";
import { TCategory } from "./category.interface";

// Define the schema
const categorySchema = new Schema<TCategory>(
  {
    CategoryName: {
      type: String,
      required: [true, "Category Name is required"],
    },
  },
  {
    timestamps: true,
  }
);

// Create the model
export const Category = model<TCategory>("Category", categorySchema);
