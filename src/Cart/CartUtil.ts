import { ObjectId } from "mongodb";
import { ResGetCartList } from "../../shared/Cart/ApiGetCartList";
import { ReqUpdateCartList } from "../../shared/Cart/ApiUpdateCartList";
import { ProductData } from "../../shared/product/Product";
import { Database } from "../Database/DataBase";
import { DbCart } from "../Database/dbitems/DbCart";
import { DbProduct } from "../Database/dbitems/dbProduct";

export class CartUtil {

    static async getCartList(uid: string): Promise<ResGetCartList> {
        let objId = new ObjectId(uid).toHexString();
        let cart = await Database.db.collection<DbCart>('Cart').find({ uid: objId })
            .limit(1)
            .next();

        if (!cart) {
            throw new Error('没有该用户购物车记录')
        }

        let productIds = cart.products.map(v => v.id);
        let products:ProductData[] = (await Database.db.collection<DbProduct>('Product').find({ $in: { _id: productIds } })
            .toArray())
            .map(v => ({
                ...v,
                _id:undefined,
                id:v._id
            }))

        let list = cart.products.map((v, i) => {
            return {
                amount: v.amount,
                spec: v.spec,
                product: products[i]
            }
        })
        return {
            isSucc:true,
            list: list
        }
    }

    static async updateCartList(uid:string,cartItem:ReqUpdateCartList){

    }
}