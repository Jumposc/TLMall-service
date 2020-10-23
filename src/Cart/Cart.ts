import express = require('express');
import { Database } from '../Database/DataBase';
import { DbCart } from '../Database/dbitems/DbCart';
import { CartUtil } from './CartUtil';
let ObjectId = require('mongodb').ObjectId
const router = express.Router();

module.exports = router;
/** 查询购物车列表 */
router.post("/getCartList", async (req, res) => {
    let uid = req.cookies.token as string;
    try {
        let items = await CartUtil.getCartList(uid);
        res.json(items);
        res.end();
    }
    catch (e) {
        res.json({
            isSucc: false,
            errMsg: e.message
        })
    }

})

/** 覆盖设置购物车 */
router.post("/set", async (req, res) => {
    let uid = req.cookies.token as string;
    let body = req.body
    try {
        let resSet = await CartUtil.setCartList(uid, body);
        res.json(resSet)
        res.end()
    }
    catch (e) {
        console.error(e)
        res.json({
            isSucc: false,
            errMsg: "添加失败"
        })
        res.end()
    }
})
