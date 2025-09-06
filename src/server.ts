/* eslint-disable no-console */
import mongoose from "mongoose";
import { Server } from "http"
import app from "./app";
import { envVars } from "./app/config/env";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";
import { connectRedis } from "./app/config/redis.config";


let server: Server;

const startServer = async() => {
    try {
        await mongoose.connect(envVars.MONGO_URI)
        console.log("Connected to DB!!")

        server = app.listen(envVars.PORT, ()=> {
            console.log(`Server is listening to port ${envVars.PORT}`);
        })

    } catch (error) {
        console.log(error)
    }
}


( async ()=> {
    await connectRedis()
    await startServer()
    await seedSuperAdmin()

} )()

// -------------------handle error-------------------------

process.on("unhandledRejection", (err) => {
    console.log("unhandled Rejection detected...Server shutting down", err)
    
    if(server){
        server.close( ()=> {
            process.exit(1)
        })
    }
    process.exit(1)
})

process.on("uncaughtException", (err) => {
    console.log("uncaught Exception detected...Server shutting down", err)
    
    if(server){
        server.close( ()=> {
            process.exit(1)
        })
    }
    process.exit(1)
})

process.on("SIGTERM", () => {
    console.log("SIGTERM signal recieved... Server shutting down..");

    if (server) {
        server.close(() => {
            process.exit(1)
        });
    }

    process.exit(1)
})

process.on("SIGINT", () => {
    console.log("SIGINT signal recieved... Server shutting down..");

    if (server) {
        server.close(() => {
            process.exit(1)
        });
    }

    process.exit(1)
})


// unhandler rejection error
// Promise.reject(new Error("I forgot to catch this promise"))

// uncaught Exception error
// throw new Error("I forgot to handle this local error")


/**
 * unhandled rejection error
 * uncaught rejection error
 * signal termination sigterm
 */
