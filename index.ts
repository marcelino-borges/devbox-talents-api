import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import mainRoutes from "./src/routes";
import connectMongo from "./src/config/mongo";
import log from "./src/utils/logs";

const canReadEnv = String(process.env.HOST);

if (canReadEnv) {
  log.success(".ENV verified!");

  const PORT = parseInt(process.env.PORT as string, 10);
  const HOST = String(process.env.HOST);

  const app = express();

  const publicCors = cors();

  connectMongo()
    .then(() => {
      app.use(publicCors);
      app.use(helmet());
      app.use(express.urlencoded({ extended: false }));
      app.use(express.json());
      app.options("*", publicCors);
      app.use("/health-check", publicCors, (_: Request, res: Response) => {
        res.status(200).json({ message: "Running", data: null });
      });
      app.options("/api/v1");
      app.use("/api/v1", mainRoutes);

      const server = app.listen(PORT || 5000, HOST || "0.0.0.0", () => {
        log.success(`API listening on port ${PORT}`);
      });

      const TIMEOUT = parseInt(process.env.SERVER_TIMEOUT || "10000", 10);

      server.timeout = TIMEOUT;
    })
    .catch((e) =>
      log.error(
        "Error trying to connect to MongoDB. API not running.",
        "Details:",
        e
      )
    );
} else {
  log.error(".ENV not available. API not running.");
}
