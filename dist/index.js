import express from 'express';
var app = express();
var port = 8080;
app.listen(port, function () {
    console.log('服务器启动于127.0.0.1:8080');
});
