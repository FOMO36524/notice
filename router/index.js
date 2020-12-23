
const controller = require('../controller/index');


//1.导入express模块
const express = require('express');
//2.创建路由
var app = express();

var bodyParser = require('body-parser');/*post方法*/
app.use(bodyParser.json());// 添加json解析
app.use(bodyParser.urlencoded({extended: false}))

app.get('/',(req,res)=>{
    res.send('welcome notice')
});
app.get('/index',controller.showHtml);
app.post('/addList',controller.addList);
// app.get('/findList',controller.findList);




//3.导出路由模块
module.exports = app;
