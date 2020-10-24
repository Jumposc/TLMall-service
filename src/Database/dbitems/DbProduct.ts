import { ObjectId } from "mongodb";
import { ProductDetail, ProductAttributeData } from "../../../shared/Product/Product";

export interface DbProduct {
    _id: string
    name: string,
    imageUrl: string,
    detail: ProductDetail,
    attribute: ProductAttributeData
    inventory:number
}