import { NextFunction, Request, Response } from "express";
import { HttpStatusCode } from "../enums/httpStatus.js";
import { IUrlController } from "../Interfaces/url/IUrlController";
import { IUrlService } from "../Interfaces/url/IUrlService";
import { EnhancedRequest } from "../types/custom-request.js";
import {get} from '../utils/redisUtils.js'

class ShortUrlController implements IUrlController {
  private urlService: IUrlService;
  constructor(urlService: IUrlService) {
    this.urlService = urlService;
  }
  public async create(req: Request, res: Response): Promise<void> {
    const { originalUrl, customAlias, topic } = req.body;
    const userId=req.user?.userId as string
    console.log("user Id",userId)
   
    
    if (!originalUrl || !customAlias || !topic) {
      res.status(HttpStatusCode.BAD_REQUEST).json({
        message: "Both originalUrl and customAlias are required.",
      });
      return; 
    }

    try {
     
      const createdShortUrl = await this.urlService.create(
        originalUrl,
        customAlias,
        topic,
        userId
      );

      if (createdShortUrl) {
        res.status(HttpStatusCode.CREATED).json({
          message: "Success",
          createdShortUrl,
        });
        return;
      }

      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        message: "Failed to create the short URL.",
      });
      return;
    } catch (error) {
      console.error("Error creating short URL:", error);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        message: "Internal Server Error",
        error: error instanceof Error ? error.message : "Unknown error",
      });
      return;
    }
  }

  public async redirectToOriginalUrl(
    req: EnhancedRequest,
    res: Response
  ): Promise<any> {
    try {
      const { alias } = req.params;
      const deviceInfo = req.deviceInfo;
      const osName = deviceInfo?.osName;
  
      
      await this.urlService.trackUrl(alias, deviceInfo);
  
    
      const longUrl = await get(alias);
      if (longUrl) {
     
        return res.redirect(longUrl);
      }
  
     
      const data = await this.urlService.getUrl(alias);
  
    
      if (!data || data.length === 0) {
        return res.status(HttpStatusCode.NOT_FOUND).json({
          message: `Short URL with alias '${alias}' not found.`,
          osName,
        });
      }
  
   
      const originalUrl = data[0].originalUrl;
      return res.redirect(originalUrl); // 
  
    } catch (error) {
      console.error("Error during URL redirection:", error);
      return res.status(500).json({
        message:
          "Internal server error occurred while processing the URL redirection.",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
  

  public async getAnalytics(req: Request, res: Response): Promise<void> {
    
    try {
      const { alias } = req.params;
      const analyticsData = await this.urlService.getAnalytics(alias);
      res.status(200).json(analyticsData);
      return;
    } catch (error) {
      console.error("Error in AnalyticsController:", error);
      res.status(500).json({
        message:
          error instanceof Error ? error.message : "Internal Server Error",
      });
      return;
    }
  }

  public async getAnalyticsByTopic(req: Request, res: Response): Promise<void> {
    const { topic } = req.params;
    console.log("hello world")

    if (!topic) {
      res.status(HttpStatusCode.BAD_REQUEST).json({
        message: "Topic parameter is required.",
      });
      return;
    }

    try {
      const analyticsData = await this.urlService.getAnalyticsByTopic(topic);

      if (!analyticsData) {
        res.status(HttpStatusCode.NOT_FOUND).json({
          message: `No analytics data found for topic '${topic}'.`,
        });
        return;
      }

      res.status(HttpStatusCode.OK).json(analyticsData);
    } catch (error) {
      console.error("Error in AnalyticsController:", error);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        message:
          error instanceof Error ? error.message : "Internal Server Error",
      });
    }
  }

  
  public async getOverallAnalytics(req: Request, res: Response): Promise<void> {
    // Check if user exists first
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized: User not found' });
      return;
    }
  
    const userId = req.user.userId;  //u Now TypeScript knows userId exists
    console.log('_________________>',userId)
    
    try {
      console.log("hello world", userId);
      const analyticsData = await this.urlService.getOverallAnalytics(userId);
      res.status(200).json(analyticsData);
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: error instanceof Error ? error.message : "Internal Server Error",
      });
    }
  }




}

export default ShortUrlController;
