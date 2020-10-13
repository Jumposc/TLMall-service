import { ObjectId } from "mongodb";

export interface DbCollect{
    _id:string,
    uid:string,
    list:string[]
}