import cors from "cors";
import express, { Application, Request, Response } from "express";
import globalErrorHandler from "./app/middleware/globalErrorHandler";
import notFound from "./app/middleware/notFound";
import router from "./app/routes";
import sendResponse from "./app/utils/sendResponse";
import bodyParser from "body-parser";

const app: Application = express();

// Body parser middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS setup
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://x-mega-pro.vercel.app",
      "https://x-mega-pro-web.vercel.app",
      "https://xmegapro.com",
      "https://dev.xmegapro.com",
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders:
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    credentials: true, // Allow sending credentials (cookies, authorization headers, etc.)
  })
);

// API routes
app.use("/api/v1", router);

// Root endpoint for a simple response
app.get("/", (req: Request, res: Response) => {
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Welcome to the music API server",
    data: {},
  });
});

// Error handling middleware
app.use(globalErrorHandler);
app.use(notFound);

export default app;
