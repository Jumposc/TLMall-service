import { ObjectId } from "mongodb";

export interface DbProductComment{
    _id: ObjectId
    productId:string,
    avatarUrl: string;
    nickName: string;
    starNumber: number;
    text: string;
    tags: string[];
    imgs: string[];
    createTime:number
}