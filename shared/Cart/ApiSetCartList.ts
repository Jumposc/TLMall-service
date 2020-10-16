import { ProductData } from '../../src/models/ProductUtil';
import { BaseReq, BaseRes } from '../Base/BaseInterface';

export interface ReqSetCartList {
    products:
    {
        id: string,
        spec: string,
        amount: number
    }[]

}

export interface ResSetCartList extends BaseRes {
    list:
    {
        product: ProductData,
        amount: number,
        spec: string
    }[]

}