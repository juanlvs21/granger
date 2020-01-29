import dotenv from "dotenv";
dotenv.config();

import app from "./app";

// Database
import "./database";

const main = () => {
  app.listen(app.get("port"));
  console.log(`Server on port ${app.get("port")}`);
};

main();
