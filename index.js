var http = require('http');

const app = require('./router/index');

const main = require('./chainx_slash_notice/main');

const port = 8888;


http.createServer(app).listen(port, function(){
    console.log('NodeCoffee server listening on port ' + port);
});

// main().catch((error) => {
//     console.log('main catch ------------')
//     console.error(error);
//     process.exit(-1);
// });

console.log('Server running at http://127.0.0.1:8888/');
