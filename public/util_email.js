'use strict';

const curTime = require("./util_time");
const cfg = require("./config");
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    "host": cfg.email.host,
    "port": cfg.email.port,
    "secureConnection": cfg.email.ssl, // use SSL
    "auth": {
        "user": cfg.email.uid, // user name
        "pass": cfg.email.pwd  // password
    }
});

exports.sendMail = async function (title, body, to) {
    const mail = {
        // 发件人 邮箱  '昵称<发件人邮箱>'
        from: '<3085861530@qq.com>',
        // 主题
        subject: '测试发送email',
        // 收件人 的邮箱 可以是其他邮箱 不一定是qq邮箱
        to: '3085861530@qq.com',
        // 内容
        text: body ,
        //这里可以添加html标签
        html: '<a href="https://www.baidu.com/">呵呵</a>'
    }
    let mailOptions = {
        from: cfg.email.from, // sender address mailfrom must be same with the user
        to: to, // list of receivers
        subject: title, // Subject line
        text: body, // plaintext body
    };
    try {
        let info = await transporter.sendMail(mail);
        console.log('---------util_email_sendMail-----------')
        console.log(curTime(), 'Message sent: ' + info.response);
    } catch(err) {
        console.log('---------util_email-----------')
        console.log(err);
    }
};
