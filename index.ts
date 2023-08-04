import express, { Request, Response, NextFunction } from "express";
import * as dotenv from "dotenv";
import connectDB from "./server/src/config/db";
import { catchInvalidJsonError } from "./server/src/middlewares/catchInvalidJsonError";
import createHttpError, { isHttpError } from "http-errors";
import userRoutes from "./server/src/routes/user";
import cors from "cors";

dotenv.config();
const app = express();

connectDB(process.env.MONGO_URI as string);

app.use(cors());
app.use(express.json());
app.use(catchInvalidJsonError);

app.use("/api/account", userRoutes);

app.use((req, res, next) => {
  next(createHttpError(404, "Endpoint not found"));
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(error);
  let errorMessage = "An unknown error occurred";
  let statusCode = 500;
  if (isHttpError(error)) {
    statusCode = error.status;
    errorMessage = error.message;
  }
  res.status(statusCode).json({ error: errorMessage });
});

app.listen(process.env.PORT, () =>
  console.log("listening on port " + process.env.PORT)
);
