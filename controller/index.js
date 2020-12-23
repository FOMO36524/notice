
const {add} = require('../model/index.js');
const fs = require('fs');

module.exports = {
    showHtml:(req,res)=>{
        fs.readFile('./views/index.html', (err, data) => {
            if (err) { // 排除文件路径错误
                console.log('index.html文件路径不正确');
                return;
            }

            res.end(data); // index页面发送给浏览器
        })
    },
    addList:(req,res)=>{
        add(req,(data,err)=>{
            if (err) {
                //服务端不能直接返回js对象，因为服务器是给所有客户端使用，需要返回json对象
                res.end(JSON.stringify({
                    err_code: 100,
                    err_msg: err.err_msg
                }));
            } else {
                res.end(JSON.stringify({
                    data:data,
                    err_code: 0,
                    err_msg: 'push success'
                }));
            }
        })
    }
};
