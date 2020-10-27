import { ObjectId } from "mongodb";

export interface DbUser{
    _id: ObjectId,
    uid:string,
    fansNum: number,
    followedNum: number,
    discoverLikeNum: number,
    productCollectNum: number,
    couponNum: number
}