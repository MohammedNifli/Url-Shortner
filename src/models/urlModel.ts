import mongoose, { Schema, Document, Types } from "mongoose";


export interface IUrl extends Document {
    shortUrl: string;
    originalUrl: string;
    customAlias?: string;
    createdBy?: Types.ObjectId; 
    totalClicks: number;
    topic?:string;
    uniqueUsers?:string[];
    createdAt: Date;
    updatedAt: Date;
    
    
    
    clicksByDate?: {
        date: string; 
        clickCount: number;
    }[];
    osType?: {
        osName: string;
        uniqueClicks: number;
        uniqueUsers: string[];
    }[];
    deviceType?: {
        deviceName: string;
        uniqueClicks: number;
        uniqueUsers: string[];
    }[];
}


const UrlSchema: Schema = new Schema<IUrl>(
    {
        shortUrl: { type: String, required: true, unique: true },
        originalUrl: { type: String, required: true },
        customAlias: { type: String, unique: true },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        totalClicks: { type: Number, default: 0 },
        topic:{type:String},
        uniqueUsers:{type:[String],default:[]},
        clicksByDate: [
            {
                date: { type: String, required: true },
                clickCount: { type: Number, default: 0 },
            },
        ],
        osType: [
            {
                osName: { type: String, required: true },
                uniqueClicks: { type: Number, default: 0 },
                uniqueUsers: { type: [String], default: [] },
            },
        ],
        deviceType: [
            {
                deviceName: { type: String, required: true },
                uniqueClicks: { type: Number, default: 0 },
                uniqueUsers: { type: [String], default: [] },
            },
        ],
    },
    {
        timestamps: true,
    }
);


export const UrlModel = mongoose.model<IUrl>("Url", UrlSchema);
