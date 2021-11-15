import express from "express";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import mongoose from "mongoose";
import profileRouter from "./apis/profiles/profiles.js"


const server = express();

//MIDDLEWARES

server.use(express.json())
server.use(cors())


//ENDPOINTS
server.use("/profile",profileRouter)


//ERROR HANDLING



mongoose.connect(process.env.MONGO_URL)


mongoose.connection.on('connected', () => {
    server.listen(process.env.PORT, () => {
        console.table(listEndpoints(server));
    })
})