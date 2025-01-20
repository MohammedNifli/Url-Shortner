import { Request as ExpressRequest } from 'express';

interface CustomRequest extends ExpressRequest {
  deviceInfo?: {
    osName: string | undefined,
    osVersion: string | undefined,
    deviceType: string | undefined,
    deviceBrand: string | undefined,
    deviceModel: string | undefined,
    browserName: string | undefined,
    browserVersion: string | undefined,
    ipAddress:string|undefined,

};
}

export  type EnhancedRequest = CustomRequest;
