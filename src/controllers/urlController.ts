import { Request, Response } from "express";
import { HttpStatusCode } from "../enums/httpStatus.js";
import { IUrlController } from "../Interfaces/url/IUrlController";
import { IUrlService } from "../Interfaces/url/IUrlService";
import { EnhancedRequest } from "../types/custom-request.js";

class ShortUrlController implements IUrlController {
  private urlService: IUrlService;
  constructor(urlService: IUrlService) {
    this.urlService = urlService;
  }
  public async create(req: Request, res: Response): Promise<void> {
    const { originalUrl, customAlias, topic, userId } = req.body;
    console.log("body data", req.body);

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
    const { alias } = req.params;
    const deviceInfo = req.deviceInfo;
    const osName = deviceInfo?.osName;

    try {
      await this.urlService.trackUrl(alias, deviceInfo);

      const data = await this.urlService.getUrl(alias);

      if (!data || data.length === 0) {
        return res.status(404).json({
          message: `Short URL with alias '${alias}' not found.`,
          osName,
        });
      }

      const originalUrl = data[0].originalUrl;

      return res.redirect(originalUrl);
    } catch (error) {
      console.error("Error during URL redirection:", error);
      return res.status(500).json({
        message:
          "Internal server error occurred while processing the URL redirection.",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // public async getAnalytics(req:Request,res:Response):Promise<Response>{
  //   const {alias}=req.params;
  //   try{
  //     const analyticsData = await

  //   }catch(error){

  //   }

  // }

  
}

export default ShortUrlController;
