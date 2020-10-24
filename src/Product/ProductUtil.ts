import { Db } from "mongodb";
import { ReqAddProduct, ResAddProduct } from "../../shared/Product/ApiAddProduct";
import { ReqAddProductCollect, ResAddProductCollect } from "../../shared/Product/ApiAddProductCollect";
import { ReqGetProductCommentList, ResGetProductCommentList } from "../../shared/Product/ApiGetProductCommentList";
import { ReqGetProductList, ResGetProductList } from "../../shared/Product/ApiGetProductList";
import { ReqGetProductOne, ResGetProductOne } from "../../shared/Product/ApiGetProductOne";
import { ReqGetProductSimpleInfos, ResGetProductSimpleInfos } from "../../shared/Product/ApiGetProductSimpleInfos";
import { ProductData, ProductSimpleInfo } from "../../shared/Product/Product";import { Database } from "../Database/DataBase";
import { DbProduct } from "../Database/dbitems/dbProduct";
import { DbCollect } from "../Database/dbitems/DbProductCollect";
import { DbProductComment } from "../Database/dbitems/DbProductComment";
let ObjectId = require('mongodb').ObjectId

export class ProductUitl {


    static async getProductList(req: ReqGetProductList): Promise<ApiRes<ResGetProductList>> {
        if (req.lastId) {
            let list: ProductData[] = (await Database.db.collection<DbProduct>('Product').find({ _id: { $gt: req.lastId } })
                .sort({ sortField: 1, _id: -1 })
                .limit(req.pageSize)
                .toArray())
                .map(v => (
                    {
                        ...v,
                        _id: undefined,
                        id: v._id
                    }
                ))
            return {
                isSucc: true,
                list: list
            }
        }
        else {
            let list: ProductData[] = (await Database.db.collection<DbProduct>('Product').find({})
                .sort({ sortField: 1, _id: -1 })
                .limit(req.pageSize)
                .toArray())
                .map(v => (
                    {
                        ...v,
                        _id: undefined,
                        id: v._id
                    }
                ))
            return {
                isSucc: true,
                list: list
            }
        }
    }
    static async getProductListById(productIds: string[]): Promise<ProductData[]> {
        let list: ProductData[] = (await Database.db.collection<DbProduct>('Product').find({ _id: { $in: productIds.map(v => ObjectId(v))} })
            .toArray())
            .map(v => (
                {
                    ...v,
                    _id: undefined,
                    id: v._id
                }
            ))
        return list
    }


    static async addProduct(req: ReqAddProduct): Promise<ApiRes<ResAddProduct>> {
        let id = (await Database.db.collection<Omit<DbProduct, '_id'>>('Product')
        .insertOne({
            name:req.name,
            imageUrl:req.imageUrl,
            detail:req.detail,
            attribute:req.attribute,
            inventory:req.inventory
        })).insertedId;
        return {

            isSucc: true,
            id: id.toHexString()
        }
    }


    static async getProduct(req: ReqGetProductOne): Promise<ApiRes<ResGetProductOne>> {
        let product = await Database.db.collection<DbProduct>('Product').findOne({ _id: ObjectId(req.productId) });
        if (!product) {
            throw new Error('没有该商品')
        }
        return {
            isSucc: true,
            data: {
                ...product,
                id: product._id
            }
        }
    }


    static async getSimpleInfos(req: ReqGetProductSimpleInfos): Promise<ApiRes<ResGetProductSimpleInfos>> {
        let productIds = req.productIds.map((v: string) => ObjectId(v));
        let resProductSimpleInfos: ProductSimpleInfo[] = (await Database.db.collection<DbProduct>("product").find({ "_id": { "$in": productIds } })
            .toArray())
            .map(v => ({
                id: v._id,
                name: v.name,
                imageUrl: v.imageUrl
            }));
        return {
            isSucc: true,
            list: resProductSimpleInfos
        }
    }

    static async addProductCollect(req: ReqAddProductCollect): Promise<ApiRes<ResAddProductCollect>> {
        await Database.db.collection<DbCollect>('Collect').findOneAndUpdate({ uid: req.token }, {
            $set: {
                $addToSet: { products: req.productId }
            }
        
        }, { upsert: true })
        return {
            isSucc: true
        }
    }


    static async getProductCommentList(req: ReqGetProductCommentList): Promise<ApiRes<ResGetProductCommentList>> {
        let pageSize = req.pageSize
        let lastId = req.lastId;
        let productId = ObjectId(req.productId);
        let list = await Database.db.collection<DbProductComment>("ProductComment").find({ "productId": productId }).toArray();
        if (lastId) {
            let lastIndex = list.findIndex(v => v._id === lastId);
            let resList = list.slice(lastIndex, lastIndex + pageSize).map((v) => ({
                ...v,
                id: v._id,
                _id: undefined
            }));
            return {
                isSucc: true,
                list: resList
            }
        } else {
            return {
                isSucc: true,
                list: list.slice(0, pageSize).map((v) => ({
                    ...v,
                    id: v._id,
                    _id: undefined
                }))
            }
        }
    }

}