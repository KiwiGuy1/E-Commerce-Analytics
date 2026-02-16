import express, { Application } from "express";
import cors from "cors";
import analyticsRoutes from "./routes/analytics";
import usersRouter from "./routes/users";
import salesRouter from "./routes/sales";

const app: Application = express();

const allowedOriginsFromEnv = (process.env.CORS_ORIGIN ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = new Set(
  allowedOriginsFromEnv.length > 0
    ? allowedOriginsFromEnv
    : ["http://localhost:3000", "http://127.0.0.1:3000"]
);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser clients and same-origin requests with no Origin header.
      if (!origin) return callback(null, true);
      return callback(
        allowedOrigins.has(origin) ? null : new Error("CORS origin not allowed"),
        allowedOrigins.has(origin)
      );
    },
  })
);
app.use(express.json());
app.use("/api/analytics", analyticsRoutes);
app.use("/api/users", usersRouter);
app.use("/api/sales", salesRouter);

export default app;
