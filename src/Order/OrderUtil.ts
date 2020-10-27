import { ObjectId } from 'mongodb';
import { ApiRes } from '../../shared/ApiRes/ApiRes'
import { ReqAddOrder, ResAddOrder } from '../../shared/order/ApiAddOrder';
import { ReqAddOrderComment, ResAddOrderComment } from '../../shared/order/ApiAddOrderComment';
import { ReqCancelOrder, ResCancelOrder } from '../../shared/order/ApiCancelOrder';
import { ReqConfirmOrder, ResConfirmOrder } from '../../shared/order/ApiConfirmOrder';
import { ReqGetOrderList, ResGetOrderList } from '../../shared/order/ApiGetOrderList';
import { ReqPayOrder, ResPayOrder } from '../../shared/order/ApiPayOrder';
import { OrderItem } from '../../shared/order/Order';
import { ProductData } from '../../shared/product/Product';
import { Database } from "../Database/DataBase";
import { DbOrder } from '../Database/dbitems/DbOrder';
import { DbProductComment } from '../Database/dbitems/DbProductComment';
import { DbUser } from '../Database/dbitems/DbUser';
import { ProductUitl } from '../Product/ProductUtil';

export class OrderUtil {
    static async add(req: ReqAddOrder): Promise<ApiRes<ResAddOrder>> {
        let products = await ProductUitl.getProductListById(req.products.map(v => v.id))
        let priceOfproducts = 0;
        let ship = 0;
        //合并购买数量和商品对象
        let orderProducts: (ProductData & { amount: number })[] = new Array(products.length);
        //计算商品价格和运费
        for (let i = 0; i < req.products.length; i++) {
            for (let j = 0; j < products.length; j++) {
                if (req.products[i].id === products[j].id) {
                    priceOfproducts += req.products[i].amount * products[j].detail.price
                    ship += products[j].detail.freight
                    orderProducts[i] = {
                        ...products[j],
                        amount: req.products[i].amount
                    }
                }
            }
        }
        //没有折扣的数据所以都是0
        let order: Omit<DbOrder, "_id"> = {
            uid: req.token,
            products: orderProducts.map(v => ({
                id: v.id,
                name: v.name,
                imageUrl: v.imageUrl,
                price: v.detail.price,
                amount: v.amount,
                freight:v.detail.freight
            })),
            status: '待付款',
            price: {
                originalCost: priceOfproducts,
                freight: ship,
                discount: 0,
                total: priceOfproducts + ship
            },
            createTime: Date.now(),
        }

        let id = (await Database.db.collection<Omit<DbOrder, "_id">>('Order').insertOne(order)).insertedId.toHexString()
        return {
            isSucc: true,
            id: id
        }

    }

    static async addComment(req: ReqAddOrderComment): Promise<ApiRes<ResAddOrderComment>> {
        let order = await Database.db.collection<DbOrder>('Order').findOne({ _id: ObjectId.createFromHexString(req.orderId) })
        if (order && order.status === '待评价') {
            let productIds = order.products.map(v => v.id)
            let user = await Database.db.collection<DbUser>('User').findOne({ _id: ObjectId.createFromHexString(req.token)})
            let comments: Omit<DbProductComment, "_id">[] = productIds.map(v => ({
                productId: v,
                avatarUrl: user!.avatar,
                nickName: user!.nickName,
                starNumber: req.star,
                text: req.content,
                tags: req.tags,
                imgs: req.images,
                createTime: Date.now()
            }))
            await Database.db.collection<Omit<DbProductComment, "_id">>('ProductComment').insertMany(comments)
            return {
                isSucc: true,
            }
        }
        else {
            throw new Error('没有该订单或还没有为待评价')
        }

    }

    static async cancel(req: ReqCancelOrder): Promise<ApiRes<ResCancelOrder>> {
        await Database.db.collection<DbOrder>('Order').findOneAndUpdate({ _id:ObjectId.createFromHexString(req.orderId)}, { $set: { status: "交易关闭" } })
        return {
            isSucc: true
        }
    }

    static async confirm(req: ReqConfirmOrder): Promise<ApiRes<ResConfirmOrder>> {
        await Database.db.collection<DbOrder>('Order').findOneAndUpdate({ _id:ObjectId.createFromHexString(req.orderId)}, { $set: { status: "待评价" } })
        return {
            isSucc: true
        }
    }

    static async getOrderList(req: ReqGetOrderList): Promise<ApiRes<ResGetOrderList>> {
        let orderList: OrderItem[] = (await this.getOrderListByStatus(req.status, req.token))
            .map(v => ({
                ...v,
                id: v._id.toHexString(),
                _id: undefined
            }))
        let lastIndex = req.lastId === undefined ? undefined:orderList.findIndex((v) => v.id === req.lastId);
        let list = lastIndex === undefined ?  orderList.slice(0, req.pageSize):orderList.slice(lastIndex,req.pageSize)

        return{
            isSucc:true,
            list:list
        }
    }

    static async getOrderListByStatus(status: ReqGetOrderList['status'], uid: string): Promise<DbOrder[]> {
        if (status === '全部') {
            return await Database.db.collection<DbOrder>('Order').find({ uid: uid})
                .sort({ sortField: 1, _id: -1 })
                .toArray()
        }
        else {
            return await Database.db.collection<DbOrder>('Order').find({ $and: [{ status: status }, { uid: uid }] })
                .sort({ sortField: 1, _id: -1 })
                .toArray()
        }

    }

    static async pay(req: ReqPayOrder): Promise<ApiRes<ResPayOrder>> {
        let order = await Database.db.collection<DbOrder>('Order').findOne({ _id: ObjectId.createFromHexString(req.orderId) })
        if (order && order.status === '待付款') {
            //支付流程完成后
            await Database.db.collection<DbOrder>('Order').findOneAndUpdate({ _id: ObjectId.createFromHexString(req.orderId) }, { $set: { status: '待发货' } })
            return {
                isSucc: true
            }
        }
        else {
            throw new Error('订单不存在或已经支付')
        }
    }
}
