import {Request ,Response} from 'express'

export interface IUrlController{

    create(req:Request,res:Response):Promise<void>
    redirectToOriginalUrl(req:Request,res:Response):Promise<any>

}
