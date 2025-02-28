const puppeteer = require("puppeteer");
const axios = require('axios');
const fs = require('fs');
const path = require('path');
async function musicAudio (url, cookie) {
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
        await page.setViewport({width: 1280, height: 800}); // 设置窗口大小为1280x800
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        // 设置 Cookie
        const cookies = cookie.split('; ').map(pair => {
            const [name, value] = pair.split('=');
            return {name, value, domain: '.163.com'};
        });
        await page.setCookie(...(cookies));
        //启动页面
        await page.goto(url, {waitUntil: "domcontentloaded", timeout: 90000});
        await page.waitForSelector('body')
        const name = await page.title();
        console.log('音频名字',name)
        await browser.close()
        return [{ id: 1, name: name, url: url }];
    } catch (err) {
        console.log(err);
    }
}
async function downloadMusicAudio(userChoose,cookie) {
    try {
        // 设置下载路径
        const downloadPath = 'F:\\workall\\fishbread\\koa\\static\\audio'; // 指定下载路径
        // 使用 path.join 拼接路径
        const tempId = Date.now(); // 时间戳作为唯一标识
        const audioFilePath = path.join(downloadPath, `${userChoose.name}_${tempId}.mp3`);
        // 确保下载路径存在
        if (!fs.existsSync(downloadPath)) {
            fs.mkdirSync(downloadPath, {recursive: true}); // recursive: true 允许创建多级目录
        }
        const newUrl = await audioUrl(userChoose.url);
        const downloadFile = async () => {
            const response = await axios({
                headers: {
                    'Referer': userChoose.url,
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36 Edg/133.0.0.0',
                    'Cookie': cookie
                },
                method: 'get',
                url: newUrl,
                responseType: 'stream'
            });
            const writer = fs.createWriteStream(audioFilePath);
            response.data.pipe(writer);
            return new Promise((resolve, reject) => {
                writer.on('finish', resolve);
                writer.on('error', reject);
            });
        }
        await downloadFile()
        return {  audioFilePath, name: userChoose.name };
    } catch (err) {
        console.log(err);
    }
}
//获取音频url
const audioUrl = (url) => {
    // 定义正则表达式，用于匹配 id 参数的值
    const idPattern = /id=(\d+)/;
    // 使用 match 方法匹配 id
    const match = url.match(idPattern);
    if (match) {
        const songId = match[1];
        url = `http://music.163.com/song/media/outer/url?id=${songId}.mp3`
        console.log('音频链接', url);
    } else {
        console.log('未找到有效的 id');
    }
    return url;
}
module.exports = { musicAudio,downloadMusicAudio };