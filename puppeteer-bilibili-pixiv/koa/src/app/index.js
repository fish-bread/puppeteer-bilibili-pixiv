const Koa = require('koa');
const { koaBody } = require('koa-body');
const cors = require('koa2-cors')
const path = require('path');
const serve = require('koa-static');
const userRouter = require('../router/user.router.js')
//jwt变量
const koaJwt = require('koa-jwt')
const JWT_SECRET = require('../UserController')
//定时清理
const schedule = require('node-schedule');
const fs = require('fs');
const directoryPath = 'F:\\workall\\fishbread\\koa\\static\\video';
//koa
const app = new Koa();
app.on('error',err=>{
    console.log(err);
})
//定时清理
function deleteAllFilesInDirectory(dir) {
    fs.readdir(dir, (err, files) => {
        if (err) {
            console.error(`Error reading directory: ${err}`);
            return;
        }

        files.forEach((file) => {
            const filePath = path.join(dir, file);
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error(`Error deleting file ${filePath}: ${err}`);
                } else {
                    console.log(`Deleted file: ${filePath}`);
                }
            });
        });
    });
}

// 设置定时器，每天 00:00 执行一次删除操作
schedule.scheduleJob('0 0 * * *', () => {
    console.log('视频文件缓存被定时清理');
    deleteAllFilesInDirectory(directoryPath);
});

//跨域
app.use(cors({
    origin: 'http://localhost:5173',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization','token',
        'Content-Disposition','Content-Length'], //设置获取其他自定义字段
    credentials: true  //允许携带cookie
}))
//静态配置
const staticPath = path.join(__dirname, '..', '..', 'static');
console.log('staticPath', staticPath);
app.use(serve(staticPath));
//post请求前置
app.use(koaBody({
    formLimit: '10mb', // 表单数据的最大限制
    jsonLimit: '10mb', // JSON 数据的最大限制
    textLimit: '10mb', // 文本数据的最大限制
    formidable: {
        maxFileSize: 200 * 1024 * 1024 // 设置最大文件大小为 200MB
    }
}))
app.use(koaJwt({secret: JWT_SECRET}).unless({path: [/^\/user\/sign/, /^\/user\/sendEmail/, /^\/static/]}));

// 使用 koa-jwt 中间件验证 JWT
//用户路由
app.use(userRouter.routes())
app.use(userRouter.allowedMethods())
module.exports = app;