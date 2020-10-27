import { ObjectId } from "mongodb";

export interface DbUser{
    _id: ObjectId,
    username: string,
    password: string,
    nickName: string,
    avatar: string,
    followedUids: string[]
}