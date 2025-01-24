import { url } from "inspector";
import { IUrlRepository } from "../Interfaces/url/IUrlRepository"
import { UrlModel } from "../models/urlModel.js"
class UrlRepository implements IUrlRepository{
  

    
    public async create(url: string, customAlias: string, topic: string, shortUrl: string,userId:string): Promise<any> {
        try {
       
            if (!url || !customAlias || !shortUrl) {
                throw new Error("Missing required fields: originalUrl, customAlias, or shortUrl.");
            }
            console.log("userId",userId)
    
            const createdData = await UrlModel.create({
                shortUrl: shortUrl,
                originalUrl: url,
                customAlias: customAlias,
                topic: topic,
                createdBy:userId
            });
    
            return createdData; 
            
        } catch (error) {
           
            console.error("Error creating short URL:", error);
            
            throw new Error(error instanceof Error ? error.message : "Unknown error while creating short URL.");
        }
}

public async getUrl(alias: string): Promise<any> {
    try {
        const getUrlData = await UrlModel.aggregate([
            {
                $match: {
                    $or: [
                        { customAlias: alias }, 
                        {
                            
                            $expr: {
                                $eq: [
                                    alias,
                                    { $arrayElemAt: [{ $split: ["$shortUrl", "/"] }, -1] }
                                ]
                            }
                        }
                    ]
                }
            }
        ]);

        
        if (getUrlData.length === 0) {
            return null;
        }

        return getUrlData; 

    } catch (error) {
        console.log("Error getting URL:", error);
        throw error; 
    }
}


public async saveUrl(urlDoc: any): Promise<void> {
    try {
        console.log('Saving URL document:', urlDoc);

        if (!urlDoc.shortUrl) {
          console.error('URL document missing shortUrl:', urlDoc);
          throw new Error("shortUrl is missing in the URL document.");
        }
  
        
        const updateResult = await UrlModel.findOneAndUpdate(
          { shortUrl: urlDoc.shortUrl },
          {
            $set: {
              totalClicks: urlDoc.totalClicks,
              customAlias:urlDoc?.customAlias,
              uniqueUsers: urlDoc.uniqueUsers,
              topic:urlDoc.topic,
              clicksByDate: urlDoc.clicksByDate,
              osType: urlDoc.osType,
              deviceType: urlDoc.deviceType
            }
          },
          { new: true }
        );
  
        if (!updateResult) {
          throw new Error("URL not found or error occurred during update.");
        }
    } catch (error) {
      console.error("Error saving URL:", error);
      throw new Error("Error saving URL");
    }
  }

  public async getAnalyticsByTopic(topic: string): Promise<any> {
    try {
      
      const urlDoc = await UrlModel.find({ topic });
  
      
      if (urlDoc && urlDoc.length === 0) {
        return null; 
      }
  
      return urlDoc; 
    } catch (error) {
      throw error; 
    }
  }
  

// Repository
public async getOverallAnalytics(userId: string): Promise<any> {
    try {
      console.log('Fetching URLs for user:', userId);
  

      const urlDocs = await UrlModel.find({
        createdBy: userId, 
      });
  

      return urlDocs;
    } catch (error) {
      
      console.log(error);
      throw error;
    }
  }
  
  


}

export default UrlRepository