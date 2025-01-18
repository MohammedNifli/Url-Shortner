import express from "express";
import {Request, Response } from 'express'
import dotenv from 'dotenv'

dotenv.config()

const app=express();

app.get('/',(req:Request,res:Response)=>{
    res.send('Hello world')

})
const port= process.env.PORT || 3000;

app.listen(port,()=>{
    console.log(`server listening at http://localhost:${port}` )
})

