import {Request ,Response} from 'express'

export interface IUrlController{

    create(req:Request,res:Response):Promise<void>
    redirectToOriginalUrl(req:Request,res:Response):Promise<any>
    getAnalytics(req: Request, res: Response): Promise<void>
    getAnalyticsByTopic(req: Request, res: Response): Promise<void>
    getOverallAnalytics(req: Request, res: Response): Promise<void> 

}
