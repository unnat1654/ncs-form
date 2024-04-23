import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import colors from "colors";
import cors from "cors";
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { isAuthorized, isLoggedIn } from "./middlewares/authMiddleware.js";

dotenv.config();

const app=express();

//middleware
app.use(cors());
app.use(morgan("dev"));

//routes
app.use("/api/admin",isLoggedIn,isAuthorized,adminRoutes);
app.use("/api/user",userRoutes);

app.get("/",(req,res)=>{
    res.send({Welcome:"Welcome to the NCS-forms backend"});
});

const PORT = process.env.PORT || 6969;
app.listen(PORT,()=>{
    console.log(`Listening on port ${PORT}`.bgGreen.white);
})

