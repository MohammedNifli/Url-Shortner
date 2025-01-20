import { Request, Response } from "express";

export interface IUrlRepository{
    create(url:string,customAlias:string,topic:string,shortUrl:string):Promise<any>
    getUrl(alias:string):Promise<any>
    saveUrl(urlDoc:any):Promise<void>
}