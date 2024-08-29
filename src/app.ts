import cors from "cors";

import express, { Application, Request, Response } from "express";
import globalErrorHandler from "./app/middleware/globalErrorHandler";
import notFound from "./app/middleware/notFound";
import router from "./app/routes";
import sendResponse from "./app/utils/sendResponse";
const app: Application = express();

app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://x-mega-pro-jibon-roy-jibon-roys-projects.vercel.app/login",
    ],
    credentials: true,
  })
);

app.use("/api/v1", router);

// const test=async(req:Request,res:Response)=>{
// Promise.reject
// }
app.get("/", (req: Request, res: Response) => {
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "welcome music api server",
    data: {},
  });
});
app.use(globalErrorHandler);
app.use(notFound);
export default app;
