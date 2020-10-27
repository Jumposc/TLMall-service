import { ObjectId } from "mongodb";

export interface DbProductCollect{
    _id:ObjectId,
    uid:string,
    list:string[]
}