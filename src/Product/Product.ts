import express = require('express');
import { ProductData, ProductSimpleInfo } from '../../shared/Product/Product';
import { Database } from '../Database/DataBase';
import { DbProduct } from '../Database/dbitems/dbProduct';
import { DbProductComment } from '../Database/dbitems/DbProductComment';
import { ProductUitl } from './ProductUtil';
let ObjectId = require('mongodb').ObjectId
const router = express.Router();

module.exports = router;

/** 获取商品列表 */
router.post("/list", async (req, res) => {
    try {
        res.json( await ProductUitl.getProductList(req.body))
        res.end()
    }
    catch (e) {
        res.json({
            isSucc: false,
            errMsg: e.message
        })
        res.end()
    }
})

/** 获取商品分类列表*/
router.get("/categories", (req, res) => {

})

/** 获取分类商品 */
router.get('/category/product', (req, res) => {

})

/** 获取一个商品 */
router.post('/one', async (req, res) => {
    try {
        res.json(await ProductUitl.getProduct(req.body))
        res.end()
    }
    catch (e) {
        res.json({
            isSucc: false,
            errMsg: e.message
        })
        res.end()
    }
})

/** 获取一组商品简单信息 */
router.post('/simpleInfos', async (req, res) => {
    try {
        res.json(await ProductUitl.getSimpleInfos(req.body))
        res.end()
    }
    catch (e) {
        res.json({
            isSucc: false,
            errMsg: e.message
        })
        res.end()
    }
})

/** 获取商品评论列表 */
router.post('/comment', async (req, res) => {
    try {
        res.json(await ProductUitl.getProductCommentList(req.body))
        res.end()
    }
    catch (e) {
        res.json({
            isSucc: false,
            errMsg: e.message
        })
        res.end()
    }
})

/** 添加一个商品 */
router.post('/add', async (req, res) => {
    try {
        res.json(await ProductUitl.addProduct(req.body))
        res.end()
    }
    catch (e) {
        res.json({
            isSucc: false,
            errMsg: e.message
        })
        res.end()
    }
})

/** 添加到收藏 */
router.post('/collect', async (req, res) => {
    try {
        res.json(await ProductUitl.addProductCollect(req.body))
        res.end()
    }
    catch (e) {
        res.json({
            isSucc: false,
            errMsg: e.message
        })
        res.end()
    }
})

