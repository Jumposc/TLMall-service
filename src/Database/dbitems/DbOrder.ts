import { ObjectId } from "mongodb";

export interface DbOrder {
    _id: ObjectId,
    uid: string,
    products: {
        id: string,
        name: string,
        imageUrl: string,
        // 单价
        freight: number,
        price: number,
        amount: number
    }[],
    status: '待付款' | '待发货' | '待收货' | '待评价' | '已完成' | '交易关闭',
    price: {
        originalCost: number,
        freight: number,
        discount: number,
        total: number
    },
    createTime: number,
    payedTime?: number
}