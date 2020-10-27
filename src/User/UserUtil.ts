import { Db, ObjectId } from "mongodb";
import { ApiRes } from "../../shared/ApiRes/ApiRes";
import { ReqGetUserStat, ResGetUserStat } from "../../shared/user/ApiGetUserStat";
import { ReqLogin, ResLogin } from "../../shared/user/ApiLogin";
import { ReqRegister, ResRegister } from "../../shared/user/ApiRegister";
import { Database } from "../Database/DataBase";
import { DbProductCollect } from "../Database/dbitems/DbProductCollect";
import { DbProductComment } from "../Database/dbitems/DbProductComment";
import { DbUser } from "../Database/dbitems/DbUser";

export class UserUtil {
    static async login(req: ReqLogin): Promise<ApiRes<ResLogin>> {
        let username = req.username;
        let password = req.password;
        let user = await Database.db.collection<DbUser>('User').findOne({ $and: [{ username: username }, { password: password }] })
        if (user) {
            return {
                isSucc: true,
                token: user._id.toHexString()
            }
        }
        else {
            throw new Error('用户名或密码错误')
        }
    }

    static async register(req: ReqRegister): Promise<ApiRes<ResRegister>> {
        let username = req.username;
        let password = req.password;
        let user = await Database.db.collection('User').findOne({ username: username })
        if (user) {
            throw new Error("该用户已存在")
        }
        await Database.db.collection('User').insertOne(
            {
                username: username,
                password: password,
                nickName: '',
                avatar: '',
                followedUids: []
            }
        )
        return {
            isSucc: true
        }

    }

    static async getUserStat(req: ReqGetUserStat): Promise<ApiRes<ResGetUserStat>> {
        return {
            isSucc: true,
            data: {
                fansNum: 0,
                followedNum: await Database.db.collection<DbUser>('User').findOne({ _id: ObjectId.createFromHexString(req.token) }).then(v => v!.followedUids.length),
                discoverLikeNum: 0,
                productCollectNum: await Database.db.collection<DbProductCollect>('ProductCollect').find({ uid: req.token }).count(),
                couponNum: 0
            }
        }
    }
}