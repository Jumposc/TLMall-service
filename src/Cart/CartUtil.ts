import { ResGetCartList } from "../../shared/Cart/ApiGetCartList";
import { ReqSetCartList, ResSetCartList } from "../../shared/Cart/ApiSetCartList";
import { ProductData } from "../../shared/product/Product";
import { Database } from "../Database/DataBase";
import { DbCart } from "../Database/dbitems/DbCart";
import { DbProduct } from "../Database/dbitems/dbProduct";
let ObjectId = require('mongodb').ObjectId

export class CartUtil {

    static async getCartList(uid: string): Promise<ResGetCartList> {
        let cart = await Database.db.collection<DbCart>('Cart').findOne({ uid: uid })

        if (!cart) {
            throw new Error('没有该用户购物车记录')
        }
        let productIds = cart.products.map(v => v.id);
        let products: ProductData[] = (await Database.db.collection<DbProduct>('Product').find({ _id: { $in: productIds } })
            .toArray())
            .map(v => ({
                ...v,
                _id: undefined,
                id: v._id
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

    static async SetCartList(uid: string, cartItem: ReqSetCartList): Promise<ResSetCartList> {
        await Database.db.collection<DbCart>('Cart').findOneAndUpdate({ uid: uid }, {
            $set: {
                products: cartItem.products
            }
        }, { upsert: true })
        let cart = await this.getCartList(uid)
        return {
            isSucc: true,
            list: cart.list
        }
    }
}