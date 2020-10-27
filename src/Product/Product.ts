import express = require('express');
import { ProductData, ProductSimpleInfo } from '../../shared/Product/Product';
import { Api } from '../Api/Api';
import { Database } from '../Database/DataBase';
import { DbProduct } from '../Database/dbitems/dbProduct';
import { DbProductComment } from '../Database/dbitems/DbProductComment';
import { ProductUitl } from './ProductUtil';
let ObjectId = require('mongodb').ObjectId
const router = express.Router();

module.exports = router;

/** 获取商品列表 */
//已测试
router.post("/list", Api.handPostApi(ProductUitl.getProductList))

/** 获取商品分类列表*/
router.post("/categories", (req, res) => {

})

/** 获取分类商品 */
router.post('/category/product', (req, res) => {

})

/** 获取一个商品 */
//已测试
router.post('/one', Api.handPostApi(ProductUitl.getProduct))

/** 获取一组商品简单信息 */
//已测试
router.post('/simpleInfos', Api.handPostApi(ProductUitl.getSimpleInfos))

/** 获取商品评论列表 */

router.post('/comment', Api.handPostApi(ProductUitl.getProductCommentList))

/** 添加一个商品 */
//已测试
router.post('/add',Api.handPostApi(ProductUitl.addProduct))

/** 添加到收藏 */
//已测试
router.post('/addCollect', Api.handPostApi(ProductUitl.addProductCollect))

