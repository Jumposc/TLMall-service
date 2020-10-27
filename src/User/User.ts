import express = require('express');
import { Api } from '../Api/Api';
import { Database } from '../Database/DataBase';
import { UserUtil } from './UserUtil';
const router = express.Router();

module.exports = router;

//已测试
router.post('/login', Api.handPostApi(UserUtil.login))

//已测试
router.post('/register', Api.handPostApi(UserUtil.register))

//未完成
router.post('/getUserStat', Api.handPostApi(UserUtil.getUserStat))
