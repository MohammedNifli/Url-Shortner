import { IUrlService } from "../Interfaces/url/IUrlService";
import { IUrlRepository } from "../Interfaces/url/IUrlRepository";
import generateShortUrl from "../utils/shortUrlGenerator.js";
import { EnhancedRequest } from "../types/custom-request";
import {
  TopicAnalytics,
  ClickByDate,
  TopicUrlAnalytics,
  UrlDoc,
  TopicUrlInfo,
} from "../types/url-types";

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
        shortUrl,
        userId
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
        topic: doc.topic,
        totalClicks: (doc.totalClicks || 0) + 1,
        uniqueUsers: Array.isArray(doc.uniqueUsers) ? [...doc.uniqueUsers] : [],
        clicksByDate: Array.isArray(doc.clicksByDate)
          ? [...doc.clicksByDate]
          : [],
        osType: Array.isArray(doc.osType) ? [...doc.osType] : [],
        deviceType: Array.isArray(doc.deviceType) ? [...doc.deviceType] : [],
      };

      const uniqueUserKey = `uniqueUser:${deviceInfo?.ipAddress}`;
      if (!updateData.uniqueUsers.includes(uniqueUserKey)) {
        updateData.uniqueUsers.push(uniqueUserKey);
      }

      const today = new Date().toISOString().split("T")[0];
      const existingDateClick = updateData.clicksByDate.find(
        (entry) => entry.date === today
      );
      if (existingDateClick) {
        existingDateClick.clickCount += 1;
      } else {
        updateData.clicksByDate.push({ date: today, clickCount: 1 });
      }

      if (deviceInfo?.osName) {
        const osEntry = updateData.osType.find(
          (entry) => entry.osName === deviceInfo.osName
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
            uniqueUsers: [deviceInfo.ipAddress],
          });
        }
      }

      if (deviceInfo?.deviceType) {
        const deviceEntry = updateData.deviceType.find(
          (entry) => entry.deviceName === deviceInfo.deviceType
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
            uniqueUsers: [deviceInfo.ipAddress],
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

  public async getAnalytics(alias: string): Promise<any> {
    try {
      const urlDoc = await this.urlRepository.getUrl(alias);

      const doc = Array.isArray(urlDoc) ? urlDoc[0] : urlDoc;

      if (!doc) {
        throw new Error(`Short URL with alias '${alias}' not found.`);
      }

      const totalClicks = doc.totalClicks;
      const uniqueUsers = doc.uniqueUsers?.length || 0;

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const clicksByDate = (doc.clicksByDate || []).filter((entry: any) => {
        const entryDate = new Date(entry.date);
        return entryDate >= sevenDaysAgo;
      });

      const osType = (doc.osType || []).map((entry: any) => ({
        osName: entry.osName,
        uniqueClicks: entry.uniqueClicks,
        uniqueUsers: entry.uniqueUsers?.length || 0,
      }));

      const deviceType = (doc.deviceType || []).map((entry: any) => ({
        deviceName: entry.deviceName,
        uniqueClicks: entry.uniqueClicks,
        uniqueUsers: entry.uniqueUsers?.length || 0,
      }));

      return {
        totalClicks,
        uniqueUsers,
        clicksByDate,
        osType,
        deviceType,
      };
    } catch (error) {
      throw error;
    }
  }

  public async getAnalyticsByTopic(topic: string): Promise<TopicAnalytics> {
    try {
      console.log("Hello world 2");
      const urlDocs = await this.urlRepository.getAnalyticsByTopic(topic);

      if (!urlDocs || urlDocs.length === 0) {
        throw new Error(`No URLs found for topic '${topic}'`);
      }

      const totalClicks = urlDocs.reduce(
        (sum: number, doc: UrlDoc) => sum + (doc.totalClicks || 0),
        0
      );

      const allUniqueUsers = new Set(
        urlDocs.flatMap((doc: UrlDoc) => doc.uniqueUsers || [])
      );
      const uniqueUsers = allUniqueUsers.size;

      const clicksByDateMap = new Map<string, number>();

      urlDocs.forEach((doc: UrlDoc) => {
        (doc.clicksByDate || []).forEach(
          (click: { date: Date; clickCount: number }) => {
            const dateStr = new Date(click.date).toISOString().split("T")[0];
            clicksByDateMap.set(
              dateStr,
              (clicksByDateMap.get(dateStr) || 0) + click.clickCount
            );
          }
        );
      });

      const clicksByDate = Array.from(clicksByDateMap.entries())
        .map(([date, clicks]) => ({
          date,
          clicks,
        }))
        .sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );

      const urls: TopicUrlInfo[] = urlDocs.map((doc: UrlDoc) => ({
        shortUrl: doc.shortUrl,
        totalClicks: doc.totalClicks || 0,
        uniqueUsers: (doc.uniqueUsers || []).length,
      }));

      return {
        totalClicks,
        uniqueUsers,
        clicksByDate,
        urls,
      };
    } catch (error) {
      throw error;
    }
  }

  public async getOverallAnalytics(userId: string): Promise<any> {
    try {
      const urlDocs = await this.urlRepository.getOverallAnalytics(userId);

      if (!urlDocs || urlDocs.length === 0) {
        throw new Error("No URLs found for this user.");
      }

      const totalUrls = urlDocs.length;

      const totalClicks = urlDocs.reduce((sum: number, doc: any) => {
        return sum + (doc.totalClicks || 0);
      }, 0);

      const uniqueUsersSet = new Set<string>();
      urlDocs.forEach((doc: any) => {
        doc.uniqueUsers?.forEach((user: string) => {
          uniqueUsersSet.add(user);
        });
      });
      const uniqueUsers = uniqueUsersSet.size;

      const clicksByDateMap: Record<string, number> = {};
      urlDocs.forEach((doc: any) => {
        doc.clicksByDate?.forEach((entry: any) => {
          const date = entry.date;
          clicksByDateMap[date] =
            (clicksByDateMap[date] || 0) + entry.clickCount;
        });
      });
      const clicksByDate = Object.entries(clicksByDateMap).map(
        ([date, clickCount]) => ({
          date,
          clickCount,
        })
      );

      const osTypeMap: Record<
        string,
        { uniqueClicks: number; uniqueUsers: Set<string> }
      > = {};
      urlDocs.forEach((doc: any) => {
        doc.osType?.forEach((entry: any) => {
          if (!osTypeMap[entry.osName]) {
            osTypeMap[entry.osName] = {
              uniqueClicks: 0,
              uniqueUsers: new Set<string>(),
            };
          }
          osTypeMap[entry.osName].uniqueClicks += entry.uniqueClicks || 0;
          entry.uniqueUsers?.forEach((user: string) => {
            osTypeMap[entry.osName].uniqueUsers.add(user);
          });
        });
      });
      const osType = Object.entries(osTypeMap).map(
        ([osName, { uniqueClicks, uniqueUsers }]) => ({
          osName,
          uniqueClicks,
          uniqueUsers: uniqueUsers.size,
        })
      );

      const deviceTypeMap: Record<
        string,
        { uniqueClicks: number; uniqueUsers: Set<string> }
      > = {};
      urlDocs.forEach((doc: any) => {
        doc.deviceType?.forEach((entry: any) => {
          if (!deviceTypeMap[entry.deviceName]) {
            deviceTypeMap[entry.deviceName] = {
              uniqueClicks: 0,
              uniqueUsers: new Set<string>(),
            };
          }
          deviceTypeMap[entry.deviceName].uniqueClicks +=
            entry.uniqueClicks || 0;
          entry.uniqueUsers?.forEach((user: string) => {
            deviceTypeMap[entry.deviceName].uniqueUsers.add(user);
          });
        });
      });
      const deviceType = Object.entries(deviceTypeMap).map(
        ([deviceName, { uniqueClicks, uniqueUsers }]) => ({
          deviceName,
          uniqueClicks,
          uniqueUsers: uniqueUsers.size,
        })
      );

      return {
        totalUrls,
        totalClicks,
        uniqueUsers,
        clicksByDate,
        osType,
        deviceType,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export default UrlShortenService;
