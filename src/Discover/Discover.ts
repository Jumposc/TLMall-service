import express = require('express');
import { Api } from '../Api/Api';
import { Database } from '../Database/DataBase';
import { DiscoverUtil } from './DiscoverUtil';
const router = express.Router();

module.exports = router;

//已测试
router.post('/getContentList',Api.handPostApi(DiscoverUtil.getContentList))