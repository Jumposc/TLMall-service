import { ObjectId } from "mongodb";

export interface DbDiscover {
    _id: ObjectId,
    content: string,
    imageUrl: string,
    creator: {
        uid: string,
        nickName: string,
        avatar: string
    },
    likedUids: string[]
}