const puppeteer = require("puppeteer");
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const HttpsProxyAgent = require("https-proxy-agent").HttpsProxyAgent;
const host = '127.0.0.1';
const port = 7897
const httpsAgent = new HttpsProxyAgent(`http://${host}:${port}`);
const pixivAxios = axios.create({
    proxy:false,
    httpsAgent
})
async function pixivPhoto (url,cookie)  {
    console.log('url:', url)
    try {
        const browser = await puppeteer.launch({
            headless: true,
            ignoreDefaultArgs: ['--disable-extensions'],
        });
    browser.on('error', async (err) => {
        console.log(err);
        await browser.close()
    })
        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 800 }); // 设置窗口大小为1280x800
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        // 设置 Cookie
        const cookies = cookie.split('; ').map(pair => {
            const [name, value] = pair.split('=');
            return {name, value, domain: '.pixiv.net'};
        });
        await page.setCookie(...(cookies));
        //启动页面
        await page.goto(url, {waitUntil: "domcontentloaded", timeout: 90000});
        await page.waitForSelector('body')
        const name = await page.title();
        console.log('图片名字',name)
        //点击a标签获取高清图片
        await page.waitForSelector('div.sc-1qpw8k9-0.gTFqQV a')
        await page.click('div.sc-1qpw8k9-0.gTFqQV a');
        //获取下载链接
        await page.waitForSelector('div.sc-1pkrz0g-1.cKLKGN img')
        const link = await page.$eval(
            'div.sc-1pkrz0g-1.cKLKGN img',
            el => el.src
        )
        //获取文件格式
        const parts = link.split('.');
        const extension = parts[parts.length - 1];
        console.log('原始图片链接:', link);
        await browser.close()
        return [{ id: 1, name: name, url: url, photoUrl: link, extension: extension }];
    } catch (error) {
        console.log(error);
        return 'error';
    }
}
// 下载图片的函数
async function downloadPixivPhoto(userChoose, cookie) {
    try {
        // 设置下载路径
        const downloadPath = 'F:\\workall\\fishbread\\koa\\static\\image'; // 指定下载路径
        // 使用 path.join 拼接路径
        const tempId = Date.now(); // 时间戳作为唯一标识
        const photoFilePath = path.join(downloadPath, `${userChoose.name}_${tempId}.${userChoose.extension}`);
        // 确保下载路径存在
        if (!fs.existsSync(downloadPath)) {
            fs.mkdirSync(downloadPath, { recursive: true }); // recursive: true 允许创建多级目录
        }
        const downloadFile = async () => {
            const response = await pixivAxios({
                headers: {
                    'Referer': userChoose.url,
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Cookie': cookie
                },
                method: 'get',
                url: userChoose.photoUrl,
                responseType: 'stream'
            });
            const writer = fs.createWriteStream(photoFilePath);
            response.data.pipe(writer);
            return new Promise((resolve, reject) => {
                writer.on('finish', resolve);
                writer.on('error', reject);
            });
        }
        await downloadFile()
        return { photoFilePath,img: userChoose.extension, name: userChoose.name };
    } catch (error) {
        console.error('下载音频时出错:', error);
    }
}
module.exports = { pixivPhoto,downloadPixivPhoto};