//Libraries imports
import express from "express";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import mongoose from "mongoose";



//Endpoints imports 
import postsRoutes from "../src/apis/posts/posts.js";
import profilesRouter from "./apis/profiles/profiles.js";

const server = express();


const whiteList = [process.env.LOCAL_FE, process.env.DEPLOYED_FE];
const corsOptions = {
  origin: (origin, callback) => {
    if (whiteList.some((allowedUrl) => allowedUrl === origin)) {
      callback(null, true);
    } else {
      const error = new Error("Not allowed by cors!");
      error.status = 403;
      callback(error);
    }
  },
};


//MIDDLEWARES
server.use(express.json())
server.use(cors(corsOptions))


//ENDPOINTS
server.use("/posts", postsRoutes)
server.use("/profile", profilesRouter)



//ERROR HANDLING



mongoose.connect(process.env.MONGO_URL)


mongoose.connection.on('connected', () => {
    server.listen(process.env.PORT, () => {
        console.table(listEndpoints(server));
    })
})