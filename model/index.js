
const fs = require('fs');
let usersJson = require('../dataJson/urls');
const jsonDir = __dirname.substring(0,__dirname.indexOf('model')) + "dataJson\\" + "urls.json";

module.exports.add = (req,callback)=>{
    let obj = {
        "url":req.body.url,
        "email":req.body.email
    };

    fs.readFile( jsonDir, function (err, data) {
        data = JSON.parse( data );
        if(!data['validators'][obj.url]){
            data['validators'][obj.url] = {};
            data['validators'][obj.url]['email_to'] = [];

            let hasEmail=data['validators'][obj.url]['email_to'].indexOf(obj.email);
            if(hasEmail<0){
                data['validators'][obj.url]['name']= 'obj';
                data['validators'][obj.url]['email_to'].push(obj.email);
            }else {
                callback('',{
                    err_msg:'error: added before'
                });
                return;
            }
            fs.writeFileSync(jsonDir,JSON.stringify(data,null,4));
            callback('',err)
        }else if(data['validators'][obj.url]){
            if(data['validators'][obj.url]['email_to']&&Array.isArray(data['validators'][obj.url]['email_to'])){
                let hasEmail=data['validators'][obj.url]['email_to'].indexOf(obj.email);
                if(hasEmail<0){
                    data['validators'][obj.url]['email_to'].push(obj.email);
                }else {
                    callback('',{
                        err_msg:'error: added before'
                    });
                    return;
                }
            }else {
                data['validators'][obj.url]['email_to'] = [];
                let hasEmail=data['validators'][obj.url]['email_to'].indexOf(obj.email);
                if(hasEmail<0){
                    data['validators'][obj.url]['email_to'].push(obj.email);
                }else {
                    callback('',{
                        err_msg:'error: added before'
                    });
                    return
                }
            }
            fs.writeFileSync(jsonDir,JSON.stringify(data,null,4));
            callback('',err)
        }else {
            callback('',{
                err_msg:'push error'
            });
        }
    });
};
