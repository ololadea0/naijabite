import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import colors from "colors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import userRouter from "./routes/authRoute.js";
import foodRouter from "./routes/foodRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import paymentRouter from "./routes/paymentRoute.js";
import errorHandler from "./middleware/errorMiddleware.js";
import uploadRouter from "./routes/uploadRoutes.js";
import settingRouter from "./routes/settingRoutes.js";
import notificationRouter from "./routes/notificationRoutes.js";

dotenv.config();
await connectDB();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = process.env.PORT || 5002;


const allowedOrigins = [
    process.env.CLIENT_URL,
    process.env.FRONTEND_URL,
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
].filter(Boolean);

// Apply CORS only to API routes. Allow the request origin and support
// credentials so cookies work when frontend and backend are served from
// the same host. If you want stricter checks, replace `origin: true`
// with a validation function and set `process.env.CLIENT_URL`.
app.use('/api', cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json({
    verify: (req, _res, buffer) => {
        if (req.originalUrl === "/api/payments/webhook")
        {
            req.rawBody = buffer;
        }
    },
}));
app.use(express.urlencoded({ extended: false }));

app.use("/api/users", userRouter);
app.use("/api/foods", foodRouter);
app.use("/api/orders", orderRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/uploads", uploadRouter);
app.use("/api/settings", settingRouter);
app.use("/api/notifications", notificationRouter);

app.get("/api/health", (_req, res) => {
    res.status(200).json({
        status: "ok",
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || "development",
    });
});

if (process.env.NODE_ENV === "production")
{
    const frontendDistPath = path.resolve(__dirname, "../frontend/dist");

    app.use(
        express.static(frontendDistPath, {
            maxAge: "1d",
            fallthrough: true
        })
    );

    app.get("/{*splat}", (req, res, next) => {
        if (!req.accepts("html"))
        {
            return next();
        }

        const indexPath = path.join(frontendDistPath, "index.html");

        res.sendFile(indexPath, (err) => {
            if (err)
            {
                next(err);
            }
        });
    });
}

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`.bgCyan.white);
});
