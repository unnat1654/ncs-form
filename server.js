import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import colors from "colors";
import cors from "cors";
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { isAuthorized, isLoggedIn } from "./middlewares/authMiddleware.js";
import connectDB from "./config/dbConfig.js";
import path from "path";
import { fileURLToPath } from "url";
import json2xls from "json2xls";


dotenv.config();

const app = express();

//esmodule fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.static(path.join(__dirname, "./dist")));
app.use(express.urlencoded({ extended: true }));
app.use(json2xls.middleware);
connectDB();

//routes
app.use("/api/admin",adminRoutes);
app.use("/api/user", userRoutes);


//rest api
app.use("*", function (req, res) {
    res.sendFile(path.join(__dirname, "./dist/index.html"));
});

const PORT = process.env.PORT || 6969;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`.bgGreen.white);
})

