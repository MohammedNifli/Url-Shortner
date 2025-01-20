import DeviceDetector from "device-detector-js";
import { Request, Response, NextFunction } from "express";
import { EnhancedRequest as CustomRequest } from "../types/custom-request"; 

const deviceDetectorMiddleware = (req: CustomRequest, res: Response, next: NextFunction): void => {
  const userAgent = req.headers["user-agent"] || ""; 

  const forwarded = req.headers["x-forwarded-for"]; 
  const ipAddress = typeof forwarded === "string" ? forwarded.split(",")[0] : req.socket.remoteAddress;

  const deviceDetector = new DeviceDetector(); 
  const result = deviceDetector.parse(userAgent); 


  req.deviceInfo = {
    osName: result.os?.name || "Unknown OS",
    osVersion: result.os?.version || "Unknown Version",
    deviceType: result.device?.type || "Unknown Device Type",
    deviceBrand: result.device?.brand || "Unknown Brand",
    deviceModel: result.device?.model || "Unknown Model",
    browserName: result.client?.name || "Unknown Browser",
    browserVersion: result.client?.version || "Unknown Version",
    ipAddress: ipAddress || "Unknown IP", 
  };

  console.log("Device Info:", req.deviceInfo);

  next();
};

export default deviceDetectorMiddleware;
