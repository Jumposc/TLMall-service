import express = require('express');
import { Api } from '../Api/Api';
import { OrderUtil } from './OrderUtil';
const router = express.Router();

module.exports = router;

//添加订单
router.post('add',Api.handPostApi(OrderUtil.add))
//添加订单评论
router.post('addComment',Api.handPostApi(OrderUtil.addComment))
//取消订单
router.post('cancel',Api.handPostApi(OrderUtil.cancel))
//确认订单
router.post('confirm',Api.handPostApi(OrderUtil.confirm))
//获取订单列表
router.post('getList',Api.handPostApi(OrderUtil.getOrderList))
//支付
router.post('pay',Api.handPostApi(OrderUtil.pay))