import express from "express";
import {Request, Response } from 'express'
import dotenv from 'dotenv'
import osInfoMiddleware from './middlewares/InfoMiddleware.js'
import urlRoute from "./routes/urlRoute.js";
import connectDB from "./config/db.js";

dotenv.config()
connectDB()

const app=express();
app.use(express.json());



app.use('/',urlRoute)


const port= process.env.PORT || 3000;

app.listen(port,()=>{
    console.log(`server listening at http://localhost:${port}` )
})

