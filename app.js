import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import cookieParser from "cookie-parser";
import postRoute from "./routes/post.route.js"
import userRoute from "./routes/user.route.js"
import authRoute from "./routes/auth.route.js"
import testRoute from "./routes/test.route.js"

//creating an instance of express
const app  = express();

dotenv.config();
//middleware
app.use(cors({
    origin: ["http://localhost:3000"],
    credentials: true
}))
app.use(cookieParser());
app.use(express.json());

app.use("/api/posts", postRoute);
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/test", testRoute);

const PORT = process.env.PORT || 8800



app.listen(PORT, ()=> {
    console.log(`Server connected to port: ${PORT}`);  
})