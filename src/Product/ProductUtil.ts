import { ResGetProductList } from "../../shared/product/ApiGetProductList";
import { ProductData } from "../../shared/product/Product";
import { Database } from "../Database/DataBase";
import { DbProduct } from "../Database/dbitems/dbProduct";

class ProductUitl {

    static async getProductList(page:number,pageSize:number,lastId?:string):Promise<ResGetProductList> {
        if(lastId){
            let list:ProductData[] = (await Database.db.collection<DbProduct>('Product').find({_id:{$gt:lastId}})
            .sort({ sortField:1,_id:-1 })
            .limit(pageSize)
            .toArray())
            .map(v => (
                {
                    ...v,
                    _id:undefined,
                    id:v._id
                }
            ))
            return {
                isSucc:true,
                list:list
            }
        }else{
            let list:ProductData[] = (await Database.db.collection<DbProduct>('Product').find({})
            .sort({ sortField:1,_id:-1 })
            .limit(pageSize)
            .toArray())
            .map(v => (
                {
                    ...v,
                    _id:undefined,
                    id:v._id
                }
            ))
            return {
                isSucc:true,
                list:list
            }
        }
    }


}