import express = require('express');
import { Database } from '../Database/DataBase';
import { DbCart } from '../Database/dbitems/DbCart';
import { CartUtil } from './CartUtil';
let ObjectId = require('mongodb').ObjectId
const router = express.Router();

module.exports = router;
/** 查询购物车列表 */
router.get("/items", async (req, res) => {
    let uid = ObjectId(req.cookies.token as string);
    let items = await CartUtil.getCartList(uid);
    res.json(items);
    res.end();
})

/** 添加商品到购物车 */
router.post("/add", async (req, res) => {
    let productId = req.body.productId as string;
    let uid = ObjectId(req.cookies.token as string);
    try {
        await Database.db.collection('cart').findOneAndUpdate({ "uid": uid }, { "$push": { "productIds": ObjectId(productId) } })
        let newCart = await CartUtil.getCartList(uid);
        res.json(newCart)
        res.end()
    }
    catch (e) {
        console.error(e)
        res.json({ errMsg: "添加失败" })
        res.end()
    }
})

/** 从购物车删除商品 */
router.post("/delete", async (req, res) => {
    let uid = ObjectId(req.cookies.token as string);
    let productIds = req.body.productIds.map((v: string) => ObjectId(v));
    try {
        await Database.db.collection<DbCart>('cart').findOneAndUpdate({ "uid": uid }, { "$pull": { "productIds": { "$in": productIds } } })
        let newCart = await CartUtil.getCartList(uid);
        res.json(newCart)
        res.end()
    }
    catch (e) {
        console.error(e)
        res.json({ errMsg: "删除失败" })
        res.end()
    }
})
