import { Db, ObjectId } from "mongodb";
import { ApiRes } from "../../shared/ApiRes/ApiRes";
import { ReqAddProduct, ResAddProduct } from "../../shared/Product/ApiAddProduct";
import { ReqAddProductCollect, ResAddProductCollect } from "../../shared/Product/ApiAddProductCollect";
import { ReqGetProductCommentList, ResGetProductCommentList } from "../../shared/Product/ApiGetProductCommentList";
import { ReqGetProductList, ResGetProductList } from "../../shared/Product/ApiGetProductList";
import { ReqGetProductOne, ResGetProductOne } from "../../shared/Product/ApiGetProductOne";
import { ReqGetProductSimpleInfos, ResGetProductSimpleInfos } from "../../shared/Product/ApiGetProductSimpleInfos";
import { ProductData, ProductSimpleInfo } from "../../shared/Product/Product"; import { Database } from "../Database/DataBase";
import { DbProduct } from "../Database/dbitems/dbProduct";
import { DbProductCollect } from "../Database/dbitems/DbProductCollect";
import { DbProductComment } from "../Database/dbitems/DbProductComment";

export class ProductUitl {


    static async getProductList(req: ReqGetProductList): Promise<ApiRes<ResGetProductList>> {
        let query = req.lastId === undefined ? {} : { _id: { $lt: ObjectId.createFromHexString(req.lastId) } }
        let list: ProductData[] = (await Database.db.collection<DbProduct>('Product').find(query)
            .sort({ sortField: -1, _id: 1 })
            .limit(req.pageSize)
            .toArray())
            .map(v => (
                {
                    ...v,
                    _id: undefined,
                    id: v._id.toHexString()
                }
            ))
        return {
            isSucc: true,
            list: list
        }
    }
    static async getProductListById(productIds: string[]): Promise<ProductData[]> {
        let list: ProductData[] = (await Database.db.collection<DbProduct>('Product').find({ _id: { $in: productIds.map(v => ObjectId.createFromHexString(v)) } })
            .toArray())
            .map(v => (
                {
                    ...v,
                    _id: undefined,
                    id: v._id.toHexString()
                }
            ))
        return list
    }


    static async addProduct(req: ReqAddProduct): Promise<ApiRes<ResAddProduct>> {
        let id = (await Database.db.collection<Omit<DbProduct, '_id'>>('Product')
            .insertOne({
                name: req.name,
                imageUrl: req.imageUrl,
                detail: req.detail,
                attribute: req.attribute,
                inventory: req.inventory
            }));
        return {

            isSucc: true,
            id: id.insertedId.toHexString()
        }
    }


    static async getProduct(req: ReqGetProductOne): Promise<ApiRes<ResGetProductOne>> {
        let product = await Database.db.collection<DbProduct>('Product').findOne({ _id: ObjectId.createFromHexString(req.productId) });
        if (!product) {
            throw new Error('没有该商品')
        }
        return {
            isSucc: true,
            data: {
                ...product,
                id: product._id.toHexString()
            }
        }
    }


    static async getSimpleInfos(req: ReqGetProductSimpleInfos): Promise<ApiRes<ResGetProductSimpleInfos>> {
        let productIds = req.productIds.map((v: string) => ObjectId.createFromHexString(v));
        let resProductSimpleInfos: ProductSimpleInfo[] = (await Database.db.collection<DbProduct>("Product").find({ _id: { "$in": productIds } })
            .toArray())
            .map(v => ({
                id: v._id.toHexString(),
                name: v.name,
                imageUrl: v.imageUrl
            }));
        return {
            isSucc: true,
            list: resProductSimpleInfos
        }
    }

    static async addProductCollect(req: ReqAddProductCollect): Promise<ApiRes<ResAddProductCollect>> {
        await Database.db.collection<DbProductCollect>('ProductCollect').findOneAndUpdate({ uid: req.token }, {
            $addToSet: { products: req.productId },
            $setOnInsert: {
                uid: req.token
            }
        }, { upsert: true })
        return {
            isSucc: true
        }
    }


    static async getProductCommentList(req: ReqGetProductCommentList): Promise<ApiRes<ResGetProductCommentList>> {
        let pageSize = req.pageSize
        let productId = req.productId;
        let query = req.lastId === undefined ? { productId: productId } : { $and: [{ productId: productId }, { _id: { $lt: ObjectId.createFromHexString(req.lastId) } }] }
        let list = await Database.db.collection<DbProductComment>("ProductComment")
            .find(query)
            .limit(pageSize)
            .toArray()
            .then(v => v.map(v => ({
                ...v,
                id: v._id,
                _id: undefined
            })));
        return {
            isSucc: true,
            list: list
        }
    }

}