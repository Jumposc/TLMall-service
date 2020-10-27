import { ReqGetDiscoverContentList, ResGetDiscoverContentList } from "../../shared/Discover/ApiGetDiscoverContentList";
import { ApiRes } from '../../shared/ApiRes/ApiRes'
import { Database } from "../Database/DataBase";
import { DbDiscover } from "../Database/dbitems/DbDiscover";
import { ObjectId } from "mongodb";


export class DiscoverUtil {
    static async getContentList(req: ReqGetDiscoverContentList): Promise<ApiRes<ResGetDiscoverContentList>> {
        let query = req.lastId === undefined ? {} : { _id: { $lt: new ObjectId(req.lastId) } }
        let list = await Database.db.collection<DbDiscover>('Discover').find(query)
            .limit(req.pageSize)
            .sort({ sortField: 1, _id: -1 })
            .toArray()
            .then(v => v.map(v => ({ ...v, _id: undefined, id: v._id.toHexString() })))
        return {
            list: list,
            isSucc: true
        }
    }
} 