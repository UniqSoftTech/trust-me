import express, { Application } from "express";
import bodyParser from "body-parser";
import cors from "cors";
// import config from "./config/env";
import router from "./routes/index";

const app: Application = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api", router);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).send({ error: "Something went wrong!" });
});

export default app;