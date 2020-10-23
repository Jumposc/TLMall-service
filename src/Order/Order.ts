import express = require('express');
import { OrderUtil } from './OrderUtil';
const router = express.Router();

module.exports = router;

/** 添加订单 */
router.post("/addOrder", async (req, res) => {
    let uid = req.cookies.token as string;
    let body = req.body
    try {
        let resAdd = await OrderUtil.addOrder(uid, body);
        res.json(resAdd)
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