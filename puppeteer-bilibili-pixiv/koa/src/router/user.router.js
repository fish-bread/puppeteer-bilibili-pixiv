//puppeteer与//cookie
//邮件验证
const nodemailer = require('nodemailer');
// 创建邮件传输器
const transporter = nodemailer.createTransport({
    service: '163', // 例如 'gmail', 'qq', '163' 等
    port: 465, // SMTP 端口
    secureConnection: true, // 使用了 SSL
    auth: {
        user: 'zx3434241933@163.com',
        pass: 'PBhwZ3BwcGVQ74C8' // 或 app password
    }
});
// 存储验证码和过期时间的键值对
const verificationCodes = new Map();
// 生成六位验证码
function generateVerificationCode() {
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += Math.floor(Math.random() * 10);
    }
    return code;
}
//调用
const Router = require('@koa/router');
const { createUser, searchUser, changeUser, deleteUser,
    searchUserUid, changeUserPassword,
    changeUserHeadshot, changeUserBackground,
    changeUserCheckIn,changeUserBackgroundImg,searchUserBackground, 
    uploadUserBilibiliCookie,uploadUserPixivCookie } = require('../service/user.service.js')
const { createUserHistory, searchUserHistoryUid, updateUserHistory } = require('../service/userHistory.service');
const router = new Router();
//文件存储
const multer = require('@koa/multer');
const syncFs = require('fs')
const fs = require('fs').promises;
const path = require('path');
// Multer 配置 (内存存储)
const storage = multer.memoryStorage();
const upload = multer({ storage });
//jwt设置
const jwt = require('jsonwebtoken');
const JWT_SECRET = require('../UserController')
//正则表达式引入
const { processUserInput, processPixivInput, processAudioInput} = require("../function/processUserInput");
const {pixivPhoto, downloadPixivPhoto } = require("../puppeteer/pixiv/photo");
const { downloadBilibiliVideo,BilibiliVideo } = require(`../puppeteer/bilibili/video.js`)
const { musicAudio,  downloadMusicAudio } = require("../puppeteer/music/audio");


//创建和登录用户
router.post('/user/sign', async (ctx, next) => {
    const {email, password, captcha} = ctx.request.body;
    console.log('验证码',captcha);
    // 获取存储的验证码
    const storedCode = verificationCodes.get(email);
    // 验证验证码是否有效
    if (!storedCode || storedCode.code !== captcha || Date.now() > storedCode.expires) {
        ctx.status = 400; // Bad Request
        ctx.body = { message: '无效或过期的验证码' };
        console.log('验证码验证失败')
        // 清除已经失效的验证码
        if ( storedCode && Date.now() > storedCode.expires) {
          verificationCodes.delete(email);
        }
        return; // 停止后续操作
    }
    // 验证码验证成功，清除验证码
    verificationCodes.delete(email);
    console.log('验证码验证成功')
    try {
        //检查用户是否存在
        const search = await searchUser(email);
        console.log('用户',search);
        if (ctx.request.body && search === undefined && captcha) {
            console.log('用户未创建',ctx.request.body);
            const user = await createUser(email, password);
            ctx.status = 201;
            console.log('创建用户成功')
            const newSearch = await searchUser(email);
            const token = jwt.sign({email: email, uid: user.uid}, JWT_SECRET, { expiresIn: '24h' });
            ctx.body = {
                mission: '用户未存在,已成功创建',
                token: token,
                userName: newSearch.user_name,
                userUid: newSearch.uid,
                userState: '在线',
                userHeadshot: newSearch.headshot,
                userBackground: newSearch.background
            }
        }
    else {
        console.log('用户已创建')
        const newSearch = await searchUser(email);
        if (password === newSearch.password ) {
            console.log('前端',password)
            console.log('数据库',newSearch.password)
            if (ctx.headers.authorization) {
                console.log('有token:', ctx.headers.authorization);
                console.log('登录状态');
            } else {
                console.log('无token')
                console.log('离线状态')
            }
            const token = jwt.sign({email: email, password: password}, JWT_SECRET, { expiresIn: '24h' });
            ctx.body = {
                mission: '用户已存在',
                token: token,
                userName: newSearch.user_name,
                userUid: newSearch.uid,
                userState: '在线',
                userHeadshot: newSearch.headshot,
                userBackground: newSearch.background
            }
            ctx.status = 200;
        } else {
            ctx.body = {
                mission: '密码不正确'
            }
            console.log('密码不正确')
            ctx.status = 401;
        }
    }
} catch (err) {
        console.error('用户注册/登录错误:'); // 更详细的错误信息
        ctx.throw(500, '服务器内部错误'); // Internal Server Error
        console.log(err);
    }
    await next()
})
//用户打开应用检查
router.post('/user/LaunchTheApp', async (ctx, next) => {
    const { Uid } = ctx.request.body
    const { uid } = await searchUserUid(Uid);
    if ( ctx.state.user === 401 ) {
        if( uid === undefined) {
            ctx.status = 401;
            ctx.body = {
                code: 0
            }
        }
        else {
            ctx.status = 200;
            ctx.body = {
                code: 1
            }
        }
    } else {
        if( uid === undefined) {
            ctx.status = 401;
        } else {
            ctx.status = 200;
            ctx.body = {
                code: 1
            }
        }
    }
    await next()
})
// 发送邮件验证码的路由
router.post('/user/sendEmail', async (ctx,next) => {
    console.log('触发邮件')
    try {
        const { to } = ctx.request.body; // 获取邮件信息
        // 检查是否已存在该邮箱的验证码，如果存在则删除
        if (verificationCodes.has(to)) {
            console.log('删除之前的验证码 for', to);
            verificationCodes.delete(to);
        }
        // 生成验证码并设置过期时间
        const verificationCode = generateVerificationCode();
        const expirationTime = Date.now() + 30 * 60 * 1000; // 30分钟过期
        verificationCodes.set(to, { code: verificationCode, expires: expirationTime });
        // 读取 HTML 文件内容
        const emailTemplatePath = 'F:\\workall\\fishbread\\koa\\static\\emailHtml.html'; // 调整路径
        let htmlContent = await fs.readFile(emailTemplatePath, 'utf-8');
        // 替换验证码占位符
        htmlContent = htmlContent.replace('${verificationCode}', verificationCode);
    const mailOptions = {
        from: 'zx3434241933@163.com',
        to,
        subject: '验证你的邮箱', // 设置默认主题
        html: htmlContent // 设置默认内容
    };
    await transporter.sendMail(mailOptions); // 发送邮件
    ctx.body = { message: '邮件发送成功' }; // 返回成功信息
} catch (error) {
    console.error('Error sending email:', error);
    ctx.throw(500, 'Failed to send email'); // 抛出错误
}
    await next()
});
//查找用户与更改用户名字
router.post('/user/changeUserName', async (ctx, next) => {
    const { userName , userUid } = ctx.request.body; 
    if (ctx.request.body) {
        console.log('用户更改的新名字', ctx.request.body)
        const res = await changeUser(userName , userUid)
        if (res.error) {
            ctx.status = 400;  // 如果更新失败，返回 400 错误
            ctx.body = {
                message: res.error,
            };
        } else {
            ctx.status = 200;  // 更新成功，返回 200 状态
            ctx.body = {
                userName: res.userNewName,  // 返回更新后的用户名
                userUid: res.userNewUid,
            };
        }
    } else {
        ctx.status = 400;  // 如果没有传递必要的参数，返回 400 错误
        ctx.body = {
            message: '缺少必要参数',
        };
    }
    await next()
})
//查找用户并更改用户密码
router.post('/user/changeUserPassword', async (ctx, next) => {
    const { userPassword , userUid } = ctx.request.body;
    if (ctx.request.body) {
        console.log('用户更改的新密码', ctx.request.body)
        const res = await changeUserPassword(userPassword , userUid)
        if (res.error) {
            ctx.status = 400;  // 如果更新失败，返回 400 错误
            ctx.body = {
                message: res.error,
            };
        } else {
            ctx.status = 200;  // 更新成功，返回 200 状态
            ctx.body = {
                userUid: res.userNewUid, // 返回更新后的用户uid
            };
        }
    } else {
        ctx.status = 400;  // 如果没有传递必要的参数，返回 400 错误
        ctx.body = {
            message: '缺少必要参数',
        };
    }
    await next()
})
//查找用户并更改头像
router.post('/user/changeUserHeadshot', upload.single('Headshot'), async (ctx, next) => {
    const { userUid }  = ctx.request.body
    const file = ctx.file;
    if (!userUid || !file) {
        ctx.status = 400;
        ctx.body = { message: '缺少 userUid  或文件' };
        return;
    }
    try {
        const fileExtension = path.extname(file.originalname);
        const newFileName = `${userUid}${fileExtension}`;
        const filePath = path.resolve(__dirname, '..', '..', 'static', 'userHeadshot', newFileName);
        await fs.writeFile(filePath, file.buffer);
        const userNewHeadshot = `/userHeadshot/${newFileName}`; // 新的头像路径
        // 调用你的 changeUserHeadshot 函数
        const updateResult = await changeUserHeadshot(userNewHeadshot, userUid);
        if (updateResult.error) { // 检查是否有错误
            ctx.status = 400;
            ctx.body = { 
                message: updateResult.error,
            };
            return;
        }
        ctx.status = 200;
        console.log('头像',userNewHeadshot)
        ctx.body = {
            message: '头像更新成功',
            imageUrl: userNewHeadshot // 返回新的头像路径
        };
    } catch (error) {
        console.error('头像保存失败:', error);
        ctx.status = 500;
        ctx.body = { message: '头像保存失败: ' + error.message }; // 返回更详细的错误信息
    }
    await next()
})
//查询用户背景
router.post('/user/searchUserBackground',async (ctx) => {
    const { userUid } = ctx.request.body
    const userBackground = await searchUserBackground(userUid)
    ctx.body = {
        background:userBackground
    }
})
//更改用户自定义背景图片
router.post('/user/changeBackgroundImage', upload.single('Background'), async (ctx) => {
    const { userUid } = ctx.request.body;
    const file = ctx.file;
    if (!userUid  || !file) {
        console.log('缺少 userUid  或文件')
        ctx.status = 400;
        return;
    }
    try {
        const fileExtension = path.extname(file.originalname);
        const newFileName = `${userUid}${fileExtension}`;
        const filePath = path.resolve(__dirname, '..', '..', 'static', 'userBackground', newFileName);
        await fs.writeFile(filePath, file.buffer);
        const userNewHeadshot = `/userBackground/${newFileName}`; // 新的头像路径
        // 调用你的 changeUserHeadshot 函数
        const updateResult = await changeUserBackgroundImg(userNewHeadshot, userUid );
        if (updateResult.error) { // 检查是否有错误
            ctx.status = 400;
            ctx.body = {
                message: updateResult.error,
            };
            return;
        }
        ctx.status = 200;
        ctx.body = {
            message: '图片更新成功',
            userBackground: updateResult.background // 返回新的头像路径
        };
    } catch (error) {
        console.error('背景保存失败:', error);
        ctx.status = 500;
        ctx.body = { message: '背景保存失败: ' + error.message }; // 返回更详细的错误信息
    }
})
//更改用户背景
router.post('/user/changeUserBackground', async (ctx) => {
    const { userNewBackground,userUid } = ctx.request.body;
    try {
        const updateResult = await changeUserBackground(userNewBackground,userUid);
        if (updateResult.error) { // 检查是否有错误
            ctx.status = 400;
            ctx.body = {
                message: updateResult.error,
            };
            return;
        }
        ctx.status = 200;
        console.log('背景',updateResult)
        ctx.body = {
            message: '背景更新成功',
            userBackground: updateResult.background// 返回新的背景
        };
    }
    catch (error) {
        console.error('用户背景保存失败', error);
        ctx.status = 500;
        ctx.body = {
            message: '背景保存失败'
        }
    }
})
//删除用户
router.post('/user/deleteUser', async (ctx, next) => {
    const { userUid } = ctx.request.body;
    if (ctx.request.body) {
        ctx.status = 200;
        const name = await deleteUser(userUid);
        ctx.body = {
            message: name.message,
        }
    }
    else {
        ctx.response.body = ctx.request.body;
        ctx.status = 500;
        console.log('用户输入信息为空')
    }
    await next()
})
//检查签到
router.post('/user/firstCheckIn', async (ctx) => {
    const { userUid } = ctx.request.body; // 获取当前登录用户的 ID
    try {
        const user = await searchUserUid(userUid);
        if (!user) {
            ctx.throw(404, '用户不存在');
        }
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // 获取今天的零点时间
        if (user.checkIn.lastCheckInDate && user.checkIn.lastCheckInDate.toDateString() === today.toDateString()) {
            // 今天已经签到过了
            ctx.body = {
                message: '今日已签到',
                isCheck: true,
                streak: user.checkIn.streak,
                totalDays: user.checkIn.totalDays
            };
            console.log('用户已签到');
        } else {
            console.log('用户未签到')
            ctx.body = {
                message: '今日未签到',
                isCheck: false,
                streak: user.checkIn.streak,
                totalDays: user.checkIn.totalDays
            };
        }
    } 
    catch (error) {
        ctx.status = error.status || 500; // 设置正确的 HTTP 状态码
        ctx.body = {message: error.message || '签到失败'}; // 返回更具体的错误信息
        console.error(error); // 打印错误信息到控制台
    }
})
//签到
router.post('/user/checkIn', async (ctx) => {
    const { userUid } = ctx.request.body; // 获取当前登录用户的 ID
    try {
        const user = await searchUserUid(userUid);
        if (!user) {
            ctx.throw(404, '用户不存在');
            return
        }
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // 获取今天的零点时间
        if (user.checkIn.lastCheckInDate && user.checkIn.lastCheckInDate.toDateString() === today.toDateString()) {
            // 今天已经签到过了
            ctx.body = { 
                message: '今日已签到',
                isCheck: true, 
                streak: user.checkIn.streak, 
                totalDays: user.checkIn.totalDays 
            };
            console.log('用户已签到');
            return; // 添加 return
        }
        let streak = user.checkIn.streak;
        if (user.checkIn.lastCheckInDate && 
            new Date(user.checkIn.lastCheckInDate).getTime() + 24 * 60 * 60 * 1000 > today.getTime()) {
            // 昨天签到过，连续签到
            streak++;
        } else {
            // 断签，重置
            streak = 1;
        }
        const updatedUser = await changeUserCheckIn(userUid, streak, today)
        ctx.body = {
            message: '签到成功',
            streak: updatedUser.checkIn.streak,  // 使用更新后的数据
            isCheck: true,
            totalDays: updatedUser.checkIn.totalDays // 使用更新后的数据
        };
    }  catch (error) {
        ctx.status = error.status || 500; // 设置正确的 HTTP 状态码
        ctx.body = {message: error.message || '签到失败'}; // 返回更具体的错误信息
        console.error(error); // 打印错误信息到控制台
    }
});
//用户历史
router.post('/user/userHistory', async (ctx) => {
    const { userUid } = ctx.request.body;
    const user = await searchUserHistoryUid(userUid);
    if (!user) {
        ctx.throw(404, '用户不存在');
        return
    }
    try {
        console.log('用户历史', user.history);
        ctx.body = {
            history: user.history
        }
    } catch (err) {
        console.log(err);
        ctx.status = 400;
    }
})
//删除用户
router.post('/user/updateUserHistory', async (ctx) => {
    const { userUid, id } = ctx.request.body;
    const result = await updateUserHistory(id, userUid);
    if (!result) {
        ctx.status = 400;
    } else {
        try {
            console.log('用户历史', result);
            ctx.body = {
                history:result.history
            }
        } catch (err) {
            console.log(err);
            ctx.status = 400;
        }
    }
})
//保存用户cookie
router.post('/user/uploadCookie', async (ctx) => {
    const { userUid,userCookie, cookieName } = ctx.request.body;
    const user = await searchUserUid(userUid);
    if (!user) {
        ctx.throw(404, '用户不存在');
        return
    }
    try {
        switch (cookieName) {
            case 'b站':
                await uploadUserBilibiliCookie(userUid, userCookie);
                break;
            case 'p站':
                await uploadUserPixivCookie(userUid, userCookie);
                break;
            default:
                ctx.throw(400, '不支持的Cookie类型');
        }
        ctx.body = { code: 200, message: 'Cookie更新成功' };
    } catch (error) {
        ctx.status = 400;
        console.log(error);
    }
})
//puppeteer搜索资源,并返回资源大小和确认如何下载
router.post('/user/puppeteerAxios', async (ctx) => {
    const { userUid, videoUrl, outWeb } = ctx.request.body;
    const user = await searchUserUid(userUid);
    if (!user) {
        ctx.throw(404, '用户不存在');
        return
    }
    try {
        if (outWeb === undefined ) {
            ctx.status = 400;
        }
        else if (outWeb === 'bilibili') {
            console.log('网站',outWeb)
            //使用正则表达式过滤
            const userInput = processUserInput(videoUrl)
            const size = await BilibiliVideo(userInput,user.user_cookies.bilibiliCookie)
            //赋值和保存历史信息
            await createUserHistory(userInput, size.videoList[0].name ,userUid)
            console.log('是否为合集',size.isMultiPart)
            //传回前端
            if (size.isMultiPart === true) {
                ctx.body = {
                    message: '成功',
                    isMulti: size.isMultiPart,
                    videoList: size.videoList,
                    userSet: size.userSet,
                    outWeb: outWeb
                }
            } else {
                ctx.body = {
                    message: '成功',
                    isMulti: size.isMultiPart,
                    videoList: size.videoList,
                    outWeb: outWeb
                }
            }
        } else if (outWeb === 'pixiv') {
            console.log('网站',outWeb)
            const url = await processPixivInput(videoUrl);
            const photo = await pixivPhoto(url,user.user_cookies.pixivCookie);
            if (photo === 'error') {
                ctx.state = 400
                ctx.error
            } else {
                ctx.state = 200
                ctx.body = {
                    isMulti: false,
                    videoList: photo,
                    outWeb: outWeb
                } 
            }
        } else if (outWeb === '网易云') {
            console.log('网站',outWeb)
            const url = processAudioInput(videoUrl);
            const audio = await musicAudio(url,user.user_cookies.pixivCookie);
            if (audio === 'error') {
                ctx.state = 400
                ctx.error
            } else {
                ctx.state = 200
                ctx.body = {
                    isMulti: false,
                    videoList: audio,
                    outWeb: outWeb
                }
            }
        } else {
            ctx.state = 400
            ctx.error
        }
    }
    catch (error) {
        ctx.status = 400;
        console.log(error);
    }
})
//向客户端发送爬取的视频/图片/音频资源
router.post('/user/downloadAxios', async (ctx) => {
    const { userUid, userChoose, outWeb } = ctx.request.body;
    const user = await searchUserUid(userUid);
    if (!user) {
        ctx.throw(404, '用户不存在');
        return
    }
    try {
        if (outWeb === 'bilibili' ) {
            const { videoMergedFilePath, videoMergedFileTitle} = await downloadBilibiliVideo(userChoose, user.user_cookies.bilibiliCookie);
            //遍历发送视频
            console.log(`正在执行循环请求视频下载`);
            // 拼接正确的文件路径
            const filePath = videoMergedFilePath[0]; // 你的视频文件路径
            const fileSize = syncFs.statSync(filePath).size;
            ctx.set('Content-Type', 'video/mp4'); // 设置正确的Content-Type
            ctx.set('Content-Length', fileSize); // 设置文件大小
            ctx.set('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(videoMergedFileTitle[0])}.mp4`);// 设置文件名
            console.log('文件名',filePath);
            ctx.response.type = 'video/mp4';
            const readStream = syncFs.createReadStream(filePath);
            readStream.on('error', (err) => {
                console.error('Error reading file:', err);
                ctx.throw(500, 'Error reading video file');
            });
            // 监听close事件，以确保文件流关闭时也能删除文件
            //readStream.on('close', () => {
               // console.log('文件流已关闭');
               // syncFs.unlink(filePath, (err) => {
               //     if (err) {
               //         console.error('Error deleting file:', err);
                //    } else {
               //         console.log('文件被正常删除');
             //       }
             //   });
           // });
            ctx.body = readStream;
        } else if (outWeb === 'pixiv') {
            const { photoFilePath,img, name } = await downloadPixivPhoto(userChoose, user.user_cookies.pixivCookie);
            //遍历发送视频
            console.log(`正在执行循环请求图片下载`);
            // 拼接正确的文件路径
            const filePath = photoFilePath; // 你的视频文件路径
            const fileSize = syncFs.statSync(filePath).size;
            ctx.set('Content-Type', `image/${img}`); // 设置正确的Content-Type
            ctx.set('Content-Length', fileSize); // 设置文件大小
            ctx.set('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(name)}.${ img }`);// 设置文件名
            console.log('文件名',filePath);
            ctx.response.type = `image/${img}`;
            const readStream = syncFs.createReadStream(filePath);
            readStream.on('error', (err) => {
                console.error('Error reading file:', err);
                ctx.throw(500, 'Error reading video file');
            });
            // 监听close事件，以确保文件流关闭时也能删除文件
            //readStream.on('close', () => {
                //console.log('文件流已关闭');
                //syncFs.unlink(filePath, (err) => {
                   // if (err) {
                      //  console.error('Error deleting file:', err);
                   // } else {
                     //   console.log('文件被正常删除');
                  //  }
                //});
            //});
            ctx.body = readStream;
        } else if (outWeb === '网易云') {
            const { audioFilePath, name } = await downloadMusicAudio(userChoose,user.user_cookies.bilibiliCookie);
            //遍历发送视频
            console.log(`正在执行循环请求图片下载`);
            // 拼接正确的文件路径
            const filePath = audioFilePath; // 你的视频文件路径
            const fileSize = syncFs.statSync(filePath).size;
            ctx.set('Content-Type', `audio/mpeg`); // 设置正确的Content-Type
            ctx.set('Content-Length', fileSize); // 设置文件大小
            ctx.set('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(name)}.mp3`);// 设置文件名
            console.log('文件名',filePath);
            ctx.response.type = `audio/mpeg`;
            const readStream = syncFs.createReadStream(filePath);
            readStream.on('error', (err) => {
                console.error('Error reading file:', err);
                ctx.throw(500, 'Error reading video file');
            });
            ctx.body = readStream;
        }
        else {
            ctx.status = 400;
        }
    } catch (err) {
        console.error(err);
        ctx.throw(500, '服务器错误');
    }
})
module.exports = router;