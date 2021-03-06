import { ObjectId } from "mongodb";
import { ProductDetail, ProductAttributeData } from "../../../shared/Product/Product";

export interface DbProduct {
    _id: ObjectId
    name: string,
    imageUrl: string,
    detail: ProductDetail,
    attribute: ProductAttributeData
    inventory:number
}