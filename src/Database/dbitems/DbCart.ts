import { ObjectId } from "mongodb";
import { DbProduct } from "./dbProduct";
import { DbUser } from "./DbUser";

export interface DbCart{
    _id: ObjectId
    uid: string,
    products:{
        id:string,
        amount:number,
        spec:string
    }[]
}

