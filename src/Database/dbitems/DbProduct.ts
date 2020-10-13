import { ObjectId } from "mongodb";
import { ProductDetail, ProductAttributeData } from "../../../shared/product/Product";

export interface DbProduct{
    _id: string
    name: string,
    imageUrl: string,
    detail: ProductDetail,
    attribute: ProductAttributeData
}