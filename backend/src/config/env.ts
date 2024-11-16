import dotenv from "dotenv";

dotenv.config();

const config = {
  app_key: process.env.APP_KEY as string,
  port: 3000 as number,
};

export default config;
