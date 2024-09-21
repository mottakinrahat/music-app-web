import mongoose from "mongoose";
import config from "./app/config";
import app from "./app";

main().catch((err) => console.log(err));

async function main() {
  try {
    // Connect to the database
    await mongoose.connect(config.database_URL as string);
    
    // Log if the connection was successful
    mongoose.connection.on("connected", () => {
      console.log("Database connected successfully");
    });

    // Log any connection errors
    mongoose.connection.on("error", (err) => {
      console.error("Database connection error:", err);
    });

    // Start the application
    app.listen(config.port, () => {
      console.log(`Example app listening on port ${config.port}`);
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("Error in database connection:", err.message);
  }
}
