export interface ClickByDate {
    date: string;
    clicks: number;
  }
  
  export interface TopicUrlAnalytics {
    shortUrl: string;
    totalClicks: number;
    uniqueUsers: number;
  }
  
  export interface TopicAnalytics {
    totalClicks: number;
    uniqueUsers: number;
    clicksByDate: ClickByDate[];
    urls: TopicUrlAnalytics[];
  }

  export interface UrlDoc {
    shortUrl: string;
    totalClicks: number;
    uniqueUsers: string[];
    clicksByDate: Array<{
      date: Date;
      clickCount: number;
    }>;
  }

  export interface TopicUrlInfo {
    shortUrl: string;
    totalClicks: number;
    uniqueUsers: number;
  }