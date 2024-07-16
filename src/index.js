import dotenv from "dotenv";
import connectDb from "./db/index.js";
import app from "./app.js";

// Load environment variables from .env file
dotenv.config({
  path: "./env",
});

connectDb()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at : ${process.env.PORT} `);
      app.on("error", (err) => {
        console.error("ERROR : ", err);
      });
    });
  })
  .catch((err) => {
    console.error("MONGODB CONNECTION FAILED!!!", err.message);
  });
