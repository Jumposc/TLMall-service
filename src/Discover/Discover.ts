import express = require('express');
import { Database } from '../Database/DataBase';
import { DiscoverUtil } from './DiscoverUtil';
const router = express.Router();

module.exports = router;

router.post('/getContentList',async (req,res)=>{
    try{
        res.json(await DiscoverUtil.getContentList(req.body))
        res.end()
    }
    catch(e){
        res.json({errMsg:e.message,isSucc:false})
        res.end()
    }
})