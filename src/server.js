import express from "express";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import mongoose from "mongoose";


const server = express();

//MIDDLEWARES

server.use(express.json())
server.use(cors())


//ENDPOINTS



//ERROR HANDLING



mongoose.connect(process.env.MONGO_URL)


mongoose.connection.on('connected', () => {
    server.listen(process.env.PORT, () => {
        console.table(listEndpoints(server));
    })
})