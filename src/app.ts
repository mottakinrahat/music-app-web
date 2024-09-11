import cors from "cors";

import express, { Application, Request, Response } from "express";
import globalErrorHandler from "./app/middleware/globalErrorHandler";
import notFound from "./app/middleware/notFound";
import router from "./app/routes";
import sendResponse from "./app/utils/sendResponse";
import bodyParser from "body-parser";
const app: Application = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:3000", "https://x-mega-pro.vercel.app"],
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
