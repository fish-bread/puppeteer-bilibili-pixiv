const puppeteer = require("puppeteer");
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

//爬取b站主体函数
async function BilibiliVideo(url, cookie) {
    try {
        //开始
        console.log('开始发送请求下载')
        console.log(url)
        const browser = await puppeteer.launch({
            headless: true,
            ignoreDefaultArgs: ['--disable-extensions'],
        });
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        // 设置 Cookie
        const cookies = cookie.split('; ').map(pair => {
            const [name, value] = pair.split('=');
            return {name, value, domain: '.bilibili.com'};
        });
        await page.setCookie(...cookies);

        await page.goto(url, {waitUntil: "domcontentloaded", timeout: 90000});

        // 判断是否是合集,如果是合集返回用户选择,如果是单集直接下载
        const isMultiPart = await page.evaluate(() => {
            return document.querySelector('.video-pod__body') !== null;
        });

        if (isMultiPart) {
            const videoList = await page.evaluate(() => {
                const items = Array.from(document.querySelectorAll('.video-pod__body .video-pod__list .video-pod__item'));
                return items.map((item, index) => {
                    //判断两种视频合集
                    const dataKey = item.getAttribute('data-key');
                    let videoUrl;
                    if (/^\d+$/.test(dataKey)) { // 如果data-key是纯数字
                        videoUrl = `${window.location.href}?p=${index + 1}`;
                    } else if (/^BV[a-zA-Z0-9]{10}$/.test(dataKey)) { // 如果data-key是BV号
                        videoUrl = `https://www.bilibili.com/video/${dataKey}`;
                    } else { // 其他情况，例如番剧，纪录片等， data-key是ep+数字, av号等
                        // 获取视频链接, 需要根据实际情况修改选择器
                        const linkElement = item.querySelector('a.video-episode-card__mask'); // 例如番剧
                        if (linkElement) {
                            videoUrl = new URL(linkElement.href).href; // 获取完整链接
                        } else {
                            console.error(`无法处理data-key: ${dataKey}`);
                            videoUrl = null; // 或其他默认值
                        }
                    }
                    return {
                        id: index + 1,
                        name: item.querySelector('.title .title-txt')?.textContent?.trim() || `视频 ${index + 1}`,
                        url: videoUrl
                    };
                }).filter(item => item.url !== null); // 过滤掉url为null的项;
            });
            await browser.close();
            console.log('是合集', isMultiPart);
            console.log('合集数组为:', videoList)
            let userSet
            for (let i = 0; i<videoList.length; i++) {
                if (videoList[i].url.split('?')[0] === url) {
                    userSet = videoList[i];
                    console.log('循环',videoList[i].url.split('?')[0]);
                    break;
                }
            }
            console.log('用户默认选择id',userSet);
            return {isMultiPart: true, videoList, userSet};
        } else {
            // 获取视频标题
            const title = await page.title();
            const cleanedTitle = title.replace(/_哔哩哔哩_bilibili/g, '').trim();
            console.log('不是合集', isMultiPart);
            console.log('合集数组为:', [{id: 1, name: cleanedTitle, url: url}])
            return {
                isMultiPart: false,
                videoList: [{id: 1, name: cleanedTitle, url: url}],
            }
        }
    }catch (error) {
        console.error(error);
    }
}
//单个视频下载函数
async function downloadBilibiliVideo (userChoose, cookie) {
    console.log('单视频:', userChoose);
    const browser = await puppeteer.launch({
        headless: true,
        ignoreDefaultArgs: ['--disable-extensions'],
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    // 设置 Cookie
    const cookies = cookie.split('; ').map(pair => {
        const [name, value] = pair.split('=');
        return { name, value, domain: '.bilibili.com' };
    });
    await page.setCookie(...cookies);
    //常量
    let videoMergedFilePath = []
    let videoMergedFileSize = []
    let videoMergedFileTitle = []
    //遍历下载视频
        await page.goto(userChoose.url, { waitUntil: "domcontentloaded", timeout: 90000 });
        // 提取视频信息
        const playinfo = await page.evaluate(() => window.__playinfo__);

        if (!playinfo?.data?.dash) {
            await browser.close();
            throw new Error("无法获取视频信息，可能需要登录或视频不存在"); // 抛出错误
        }

        const videoUrl = playinfo.data.dash.video[0].baseUrl;
        const audioUrl = playinfo.data.dash.audio[0].baseUrl;

        // 设置下载路径
        const downloadPath = 'F:\\workall\\fishbread\\koa\\static\\video'; // 指定下载路径
        // 确保下载路径存在
        if (!fs.existsSync(downloadPath)) {
            fs.mkdirSync(downloadPath, { recursive: true }); // recursive: true 允许创建多级目录
        }
        // 使用 Axios 下载文件
        const downloadFile = async (fileUrl, filePath) => {
            try {
                const response = await axios({
                    url: fileUrl,
                    method: 'GET',
                    responseType: 'stream', // 关键：以流的形式获取数据
                    headers: {
                        'Referer': userChoose.url,
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                        'Cookie': cookie
                    }
                });

                const writer = fs.createWriteStream(filePath); // 创建写入流
                response.data.pipe(writer); // 将响应数据流式传输到文件


                return new Promise((resolve, reject) => {
                    writer.on('finish', resolve);
                    writer.on('error', reject);
                });

            } catch (error) {
                console.error(`下载 ${filePath} 失败:`, error);
                throw error; // 重新抛出错误，以便外部捕获
            }
        };
        // 定义 videoFilePath 和 audioFilePath
        // 使用 path.join 拼接路径
        const tempId = Date.now(); // 时间戳作为唯一标识
        const videoFilePath = path.join(downloadPath, `${userChoose.name}_${tempId}.mp4`);
        const audioFilePath = path.join(downloadPath, `${userChoose.name}_${tempId}.mp3`);
        // 下载音频和视频
        await downloadFile(videoUrl, videoFilePath);
        await downloadFile(audioUrl, audioFilePath);

        console.log(`视频 "${userChoose.name}" 下载完成！`);
        // 合并音频和视频
        console.log(`视频和音频下载完成，开始合并...`);
        const mergedFilePath = path.join(downloadPath, `${userChoose.name}_${tempId}_merged.mp4`);
        await mergeVideoAndAudio(videoFilePath, audioFilePath, mergedFilePath);
        console.log(`合并后的视频已保存到: ${mergedFilePath}`);
        //保存到数组中
        videoMergedFilePath.push(mergedFilePath);
        videoMergedFileTitle.push(`${userChoose.name}_${tempId}_merged`)
    // 关闭浏览器
    await browser.close();
    return {isMultiPart: false, videoMergedFilePath, videoMergedFileTitle };
}
// 合并视频和音频的函数
async function mergeVideoAndAudio(videoPath, audioPath, outputPath) {
    return new Promise((resolve, reject) => {
        // 使用 ffmpeg 命令合并视频和音频
        const command = `ffmpeg -i "${videoPath}" -i "${audioPath}" -c:v copy -c:a aac -strict experimental -map 0:v:0 -map 1:a:0 "${outputPath}"`;

        // 执行 ffmpeg 命令
        exec(command,{ timeout: 30000 }, async (error, stdout, stderr) => {
            if (error) {
                console.error(`合并视频和音频失败: ${error}`);
                reject(error);
                return;
            }
            // 获取合并后视频大小
            console.log(`合并完成: ${outputPath}`);

            try {
                // 删除视频和音频文件
                await fs.promises.unlink(videoPath);
                await fs.promises.unlink(audioPath);
                console.log("已删除原始视频和音频文件");
            } catch (deleteError) {
                console.error("删除文件时出错:", deleteError);
                // 注意：这里只记录错误，不reject，因为合并已经成功
            }
           
            resolve(); // 合并成功后 resolve Promise
        });
    });
}
module.exports = { downloadBilibiliVideo, BilibiliVideo };