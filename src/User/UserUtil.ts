import { ApiRes } from "../../shared/ApiRes/ApiRes";
import { ReqGetUserStat, ResGetUserStat } from "../../shared/user/ApiGetUserStat";
import { ReqLogin, ResLogin } from "../../shared/user/ApiLogin";
import { ReqRegister, ResRegister } from "../../shared/user/ApiRegister";
import { Database } from "../Database/DataBase";
import { DbUser } from "../Database/dbitems/DbUser";
let ObjectId = require('mongodb').ObjectId

class UserUtil {
    static async login(req: ReqLogin): Promise<ApiRes<ResLogin>> {
        let username = req.username;
        let password = req.password;
        let user = await Database.db.collection('User').findOne({ username: username })
        if (user && user.password === password) {
            return {
                isSucc: true,
                token: user._id
            }
        }
        else {
            return {
                isSucc: false,
                errMsg: '用户名或密码错误'
            }
        }
    }

    static async register(req: ReqRegister): Promise<ApiRes<ResRegister>> {
        let username = req.username;
        let password = req.password;
        let user = await Database.db.collection('User').findOne({ username: username })
        if (user) {
            return {
                isSucc: false,
                errMsg: "该用户已存在"
            }
        }
        else {
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
    }

    static async getUserStat(req: ReqGetUserStat): Promise<ApiRes<ResGetUserStat>> {
        return {
            isSucc: true,
            data: {
                fansNum: 0,
                followedNum: 0,
                discoverLikeNum: 0,
                productCollectNum: 0,
                couponNum: 0
            }
        }
    }
}