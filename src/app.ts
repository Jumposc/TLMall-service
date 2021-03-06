import express = require('express');
import bodyParser = require('body-parser');
import { Database } from './Database/DataBase';
import cookieParser = require('cookie-parser')
import { ProductUitl } from './Product/ProductUtil';
import { Api } from './Api/Api';
const User = require('./User/User')
const Cart = require('./Cart/Cart')
const Product = require('./Product/Product')
const Discover = require('./Discover/Discover')
const Order = require('./Order/Order')
const app = express();

const port = 8080;
const hostname = '127.0.0.1';
app.listen(port, hostname, () => {
    console.log(`服务器启动于http://${hostname}:${port}`)
    Database.init();
    console.log()
})

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/user', User);
app.use('/cart', Cart);
app.use('/product', Product)
app.use('/order', Order)
app.use('/discover',Discover)

