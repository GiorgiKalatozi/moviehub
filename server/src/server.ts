import mongoose from "mongoose";
import app from "@/app";
import env from "@/utils/validate-env";

const PORT = env.PORT || 5000;

mongoose
  .connect(env.MONGO_CONNECTION_STRING)
  .then(() => {
    console.log("Database connected!");
    app.listen(PORT, () => {
      console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => console.log(error));
