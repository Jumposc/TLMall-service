import { ReqGetDiscoverContentList, ResGetDiscoverContentList } from "../../shared/Discover/ApiGetDiscoverContentList";
import { ApiRes } from '../../shared/ApiRes/ApiRes'
import { Database } from "../Database/DataBase";
import { DbDiscover } from "../Database/dbitems/DbDiscover";
let ObjectId = require('mongodb').ObjectId

export class DiscoverUtil {
    static async getContentList(req: ReqGetDiscoverContentList): Promise<ApiRes<ResGetDiscoverContentList>> {
        if (req.lastId) {
            let list = await Database.db.collection<DbDiscover>('Discover').find({ _id: { $gt: ObjectId(req.lastId) } })
                .limit(req.pageSize)
                .toArray()
                .then(v => v.map(v => ({ ...v, _id: undefined, id: v._id })))
            return {
                list: list,
                isSucc: true
            }
        } else {
            let list = await Database.db.collection<DbDiscover>('Discover').find({})
                .limit(req.pageSize)
                .toArray()
                .then(v => v.map(v => ({ ...v, _id: undefined, id: v._id })))
            return {
                list: list,
                isSucc: true
            }
        }
    }
} 