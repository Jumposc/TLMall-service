import express = require('express');
import { Database } from '../Database/DataBase';
const router = express.Router();

module.exports = router;

router.post('/login',async (req,res)=>{
    let username = req.body.username as string;
    let password = req.body.password as string;
    let user = await Database.db.collection('User').findOne({username:username})
    if(user && user.password === password){
        res.cookie("token",user._id)
        res.end();
    }
    else{
        res.json({errMsg:"没有该用户或密码错误"})
        res.end();
    }
})

