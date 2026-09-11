import express from "express";
import dbConnect from "./helpers/dbConnect.helper.js";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import "dotenv/config.js";
import serverRouter from "./routes/server.router.js";
import pathHandler from "./middlewares/pathHandler.mid.js";
import errorHandler from "./middlewares/errorHandler.mid.js";

const APP = express();
const PORT = process.env.PORT //|| 8080;

const READY = async () => {
    if(process.env.PERSISTENCE === "mongo") {
        await dbConnect(process.env.LINK_DB);
        console.log(`PORT: ${PORT}`);
    } else if (process.env.PERSISTENCE === "fs") {
        console.error("FS not implemented!");
    } else {
        console.error("Memory not implemented!");
    };
};

/* ----------------- Middlewares --------------------- */

const allowedOirigins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:4173",
    "https://frontend-production-594c.up.railway.app",
    "frontend-production-c23e.up.railway.app"
];

APP.use(cors({
    origin: function(origin, callback) {
        if(!origin) return callback(null, true);
        if(allowedOirigins.includes(origin)) { callback(null, true); }
        else { callback(new Error("CORS Not allowed!")); };
    },
    credentials: true,
    methods: "GET,HEAD,OPTIONS,POST,PUT,DELETE",
    allowedHeaders: "Origin, X-Requested-Width, Content-Type, Accept, Authorization"
}));

APP.use(compression());
APP.use(cookieParser(process.env.SECRET));
APP.use(express.json());
APP.use(express.urlencoded({ extended: true }));
APP.use(morgan("dev"));

/* -------------------- Routes ------------------------ */

APP.use("/api", serverRouter);

/* ---------- Middleware 404 and Erros ------------ */

APP.use(pathHandler);
APP.use(errorHandler);

/* ----------------- Start Server ----------------- */

APP.listen(PORT, READY);