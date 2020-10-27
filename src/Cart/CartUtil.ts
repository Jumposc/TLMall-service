import { ObjectId } from "mongodb";
import { ReqGetCartList, ResGetCartList } from "../../shared/Cart/ApiGetCartList";
import { ReqSetCartList, ResSetCartList } from "../../shared/Cart/ApiSetCartList";
import { ProductData } from "../../shared/Product/Product";
import { Database } from "../Database/DataBase";
import { DbCart } from "../Database/dbitems/DbCart";
import { DbProduct } from "../Database/dbitems/dbProduct";

export class CartUtil {

    static async getCartList(req:ReqGetCartList): Promise<ResGetCartList> {
        let cart = await Database.db.collection<DbCart>('Cart').findOne({ uid: req.token })

        if (!cart) {
            throw new Error('没有该用户购物车记录')
        }
        let productIds = cart.products.map(v => ObjectId.createFromHexString(v.id));
        let products: ProductData[] = (await Database.db.collection<DbProduct>('Product').find({ _id: { $in: productIds } })
            .toArray())
            .map(v => ({
                ...v,
                _id: undefined,
                id: v._id.toHexString()
            }))

        let list = cart.products.map((v, i) => {
            return {
                amount: v.amount,
                spec: v.spec,
                product: products[i]
            }
        })
        return {
            isSucc: true,
            list: list
        }
    }

    static async setCartList(req:ReqSetCartList): Promise<ResSetCartList> {
        await Database.db.collection<DbCart>('Cart').findOneAndUpdate({ uid: req.token }, {
            $set: {
                products: req.products
            },
            $setOnInsert:{
                uid:req.token
            }
        }, { upsert: true })
        let cart = await this.getCartList({token:req.token})
        return {
            isSucc: true,
            list: cart.list
        }
    }
}