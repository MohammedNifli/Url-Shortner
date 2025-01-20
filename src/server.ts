import express from "express";
import {Request, Response } from 'express'
import dotenv from 'dotenv'

import urlRoute from "./routes/urlRoute.js";
import connectDB from "./config/db.js";
import userRoute from "./routes/userRoute.js";
import cookieParser from 'cookie-parser'
import session from "express-session";



dotenv.config()
connectDB()

const app=express();
app.use(cookieParser());

app.use(express.json());


app.use(session({
    secret: 'your-secret-key',  
    resave: false,
    saveUninitialized: true,
  }));





app.use('/',urlRoute)
app.use('/user',userRoute)


const port= process.env.PORT || 3000;

app.listen(port,()=>{
    console.log(`server listening at http://localhost:${port}` )
})

