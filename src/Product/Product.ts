import express = require('express');
import { ProductData, ProductSimpleInfo } from '../../shared/product/Product';
import { Database } from '../Database/DataBase';
import { DbProduct } from '../Database/dbitems/dbProduct';
import { DbProductComment } from '../Database/dbitems/DbProductComment';
let ObjectId = require('mongodb').ObjectId
const router = express.Router();

module.exports = router;

/** 获取商品列表 */
router.get("/list", async (req, res) => {
    let pageSize = parseInt(req.query.pageSize as string);
    let lastId = req.query?.lastId as string;
    let list = await Database.db.collection<DbProduct>("product").find({}).sort({ sortField:1,_id:-1 }).toArray();
    if(lastId){
        let lastIndex = list.findIndex((v) => v._id === lastId);
        let resList = list.slice(lastIndex,lastIndex + pageSize).map(v => ({
            ...v,
            id:v._id,
            _id:undefined
        }));
        res.json(resList);
    }else{
        res.json(list.slice(0,pageSize).map(v => ({
            ...v,
            id:v._id,
            _id:undefined
        })))
    }
})

/** 获取商品分类列表*/
router.get("/categories", (req, res) => {

})

/** 获取分类商品 */
router.get('/category/product', (req, res) => {

})

/** 获取一个商品 */
router.get('/one', async (req, res) => {
    let productId = ObjectId(req.query.productId);
    let product = await Database.db.collection<DbProduct>('product').findOne({ "_id": productId })
    if (product) {
        let resProduct:ProductData = {
            id: product._id,
            name: product.name,
            detail:product.detail,
            attribute:product.attribute,
            imageUrl:product.imageUrl
        }
        res.json(resProduct)
    }else{
        res.json({errMsg:"没有该商品"})
    }
})

/** 获取一组商品简单信息 */
router.post('/simpleInfos', async (req, res) => {
    let productIds = req.body.productIds.map((v:string) => ObjectId(v));
    let resProductSimpleInfos:ProductSimpleInfo[] = (await Database.db.collection<DbProduct>("product").find({"_id":{"$in":productIds}})
    .toArray())
    .map(v => ({
        id:v._id,
        name:v.name,
        imageUrl:v.imageUrl
    }));
    res.json(resProductSimpleInfos);
    res.end();
})

/** 获取商品评论列表 */
router.get('/comment', async (req, res) => {
    let pageSize = parseInt(req.query.pageSize as string);
    let lastId = req.query?.lastId as string;
    let productId = ObjectId(req.query.productId);
    let list =  await Database.db.collection<DbProductComment>("comment").find({"productId":productId}).toArray();
    if(lastId){
        let lastIndex = list.findIndex(v => v._id === lastId);
        let resList = list.slice(lastIndex,lastIndex + pageSize).map((v) => ({
            ...v,
            id:v._id,
            _id:undefined
        }));
        res.json(resList);
    }else{
        res.json(list.slice(0,pageSize).map((v) => ({
            ...v,
            id:v._id,
            _id:undefined
        })));
    }
})

/** 添加一个商品 */
router.post('/add', async (req, res) => {
    let product = req.body.product;
    console.log(product);
    await Database.db.collection('product').insertOne(product);
    res.end();
})

/** 添加到收藏 */
router.post('/collect', async (req, res) => {
    let productId = req.body.collect;
    let uid = ObjectId(req.cookies.token as string);
    await Database.db.collection('collect').findOneAndUpdate({ uid: uid }, { "list": { "$push": ObjectId(productId) } })
})

