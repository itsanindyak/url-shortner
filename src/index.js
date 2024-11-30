import dotenv from "dotenv";
import { app } from "./app.js";
import { connectDB, connectRedis } from "./db/index.js";

dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8400, () => {
      console.log(`Server is running at port${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection failed!!", error);
  });

export const client = await connectRedis();
