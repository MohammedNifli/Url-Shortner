import { EnhancedRequest } from "../../types/custom-request"
export interface IUrlService{
    create(url:string,customAlias:string,topic:string,userId:string):Promise<any>
    getUrl(alias:string):Promise<any>
    trackUrl(
        alias: string,
        deviceInfo: EnhancedRequest["deviceInfo"]
      ): Promise<void>
      getAnalytics(alias:string):Promise<any>
      getAnalyticsByTopic(topic:string):Promise<any>
      getOverallAnalytics(userId:string):Promise<any>
}