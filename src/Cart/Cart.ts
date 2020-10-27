import express = require('express');
import { Api } from '../Api/Api';
import { Database } from '../Database/DataBase';
import { DbCart } from '../Database/dbitems/DbCart';
import { CartUtil } from './CartUtil';
let ObjectId = require('mongodb').ObjectId
const router = express.Router();

module.exports = router;
/** 查询购物车列表 */
router.post("/getCartList", Api.handPostApi(CartUtil.getCartList))

/** 覆盖设置购物车 */
router.post("/set", Api.handPostApi(CartUtil.setCartList))
