import { IUrlService } from "../Interfaces/url/IUrlService";
import { IUrlRepository } from "../Interfaces/url/IUrlRepository";
import generateShortUrl from "../utils/shortUrlGenerator.js";
import { EnhancedRequest } from "../types/custom-request";

class UrlShortenService implements IUrlService {
  private urlRepository: IUrlRepository;
  constructor(urlRepository: IUrlRepository) {
    this.urlRepository = urlRepository;
  }

  public async create(
    url: string,
    customAlias: string,
    topic: string,
    userId: string
  ): Promise<any> {
    try {
      const shortUrl = generateShortUrl(customAlias);
      console.log("short urrrrl", shortUrl);
      const createdData = await this.urlRepository.create(
        url,
        customAlias,
        topic,
        shortUrl
      );
      return createdData;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  public async getUrl(alias: string): Promise<any> {
    try {
      const data = await this.urlRepository.getUrl(alias);
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  public async trackUrl(
    alias: string,
    deviceInfo: EnhancedRequest["deviceInfo"]
  ): Promise<void> {
    try {
        const urlDoc = await this.urlRepository.getUrl(alias);
        console.log("Original urlDoc", urlDoc);
  
        if (!urlDoc || !Array.isArray(urlDoc) || urlDoc.length === 0) {
          throw new Error("URL not found.");
        }
  
       
        const doc = urlDoc[0];
        
       
        const updateData = {
          shortUrl: doc.shortUrl,  
          originalUrl: doc.originalUrl,
          customAlias: alias,
          totalClicks: (doc.totalClicks || 0) + 1,
          uniqueUsers: Array.isArray(doc.uniqueUsers) ? [...doc.uniqueUsers] : [],
          clicksByDate: Array.isArray(doc.clicksByDate) ? [...doc.clicksByDate] : [],
          osType: Array.isArray(doc.osType) ? [...doc.osType] : [],
          deviceType: Array.isArray(doc.deviceType) ? [...doc.deviceType]  : []
        };
  
        // Update unique users
        const uniqueUserKey = `uniqueUser:${deviceInfo?.ipAddress}`;
        if (!updateData.uniqueUsers.includes(uniqueUserKey)) {
          updateData.uniqueUsers.push(uniqueUserKey);
        }
  
       
        const today = new Date().toISOString().split("T")[0];
        const existingDateClick = updateData.clicksByDate.find(
          entry => entry.date === today
        );
        if (existingDateClick) {
          existingDateClick.clickCount += 1;
        } else {
          updateData.clicksByDate.push({ date: today, clickCount: 1 });
        }
  
       
        if (deviceInfo?.osName) {
          const osEntry = updateData.osType.find(
            entry => entry.osName === deviceInfo.osName
          );
          if (osEntry && deviceInfo.ipAddress) {
            osEntry.uniqueClicks += 1;
            if (!osEntry.uniqueUsers.includes(deviceInfo.ipAddress)) {
              osEntry.uniqueUsers.push(deviceInfo.ipAddress);
            }
          } else if (deviceInfo.ipAddress) {
            updateData.osType.push({
              osName: deviceInfo.osName,
              uniqueClicks: 1,
              uniqueUsers: [deviceInfo.ipAddress]
            });
          }
        }
  
        // Update device type
        if (deviceInfo?.deviceType) {
          const deviceEntry = updateData.deviceType.find(
            entry => entry.deviceName === deviceInfo.deviceType
          );
          if (deviceEntry && deviceInfo.ipAddress) {
            deviceEntry.uniqueClicks += 1;
            if (!deviceEntry.uniqueUsers.includes(deviceInfo.ipAddress)) {
              deviceEntry.uniqueUsers.push(deviceInfo.ipAddress);
            }
          } else if (deviceInfo.ipAddress) {
            updateData.deviceType.push({
              deviceName: deviceInfo.deviceType,
              uniqueClicks: 1,
              uniqueUsers: [deviceInfo.ipAddress]
            });
          }
        }
  
        console.log("Final update data:", updateData);
        await this.urlRepository.saveUrl(updateData);
  
    } catch (error) {
      console.error("Error updating URL click data:", error);
      throw new Error("Error tracking URL click.");
    }
  }
  
  
  
}

export default UrlShortenService;
