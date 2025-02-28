function processUserInput(videoUrl) {
    // 正则表达式匹配完整的B站视频URL
    const fullUrlPattern = /^https:\/\/www\.bilibili\.com\/video\/(BV[A-Za-z0-9]{10})\/?(\?.*)?$/;
    // 正则表达式匹配纯BV号
    const bvPattern = /^(BV[A-Za-z0-9]{10})$/;
    let bvId;
    if (fullUrlPattern.test(videoUrl)) {
        // 从完整URL中提取BV号
        bvId = videoUrl.match(fullUrlPattern)[1];
    } else if (bvPattern.test(videoUrl)) {
        // 直接使用BV号
        bvId = videoUrl;
    } else {
        throw new Error('无效的输入'); // 其他情况报错
    }
    // 返回统一格式的URL
    return `https://www.bilibili.com/video/${bvId}`;
}
function processPixivInput(photoUrl) {
    const fullUrlPattern = /^https:\/\/www\.pixiv\.net\/artworks\/(\d{9})\/?$/; // 匹配完整URL
    const idPattern = /^(\d{9})$/; // 匹配纯九位数字ID

    let pixivId;

    if (fullUrlPattern.test(photoUrl)) {
        pixivId = photoUrl.match(fullUrlPattern)[1];
    } else if (idPattern.test(photoUrl)) {
        pixivId = photoUrl;
    } else {
        throw new Error('无效的Pixiv作品链接');  // 其他情况报错，更友好的错误信息
    }

    return `https://www.pixiv.net/artworks/${pixivId}`; // 返回统一格式的URL
}
function processAudioInput(songInput) {
    // 匹配完整的网易云音乐歌曲链接
    const fullUrlPattern = /^https:\/\/music\.163\.com\/#\/song\?id=(\d+)$/;
    // 匹配纯数字的歌曲 ID
    const idPattern = /^\d+$/;

    let songId;

    if (fullUrlPattern.test(songInput)) {
        // 如果输入是完整链接，提取其中的歌曲 ID
        songId = songInput.match(fullUrlPattern)[1];
    } else if (idPattern.test(songInput)) {
        // 如果输入是纯数字 ID，直接使用该 ID
        songId = songInput;
    } else {
        // 其他情况抛出错误，提示输入无效
        throw new Error('无效的网易云音乐歌曲链接或 ID');
    }

    // 返回统一格式的网易云音乐歌曲链接
    return `https://music.163.com/#/song?id=${songId}`;
}
module.exports = { processUserInput, processPixivInput,processAudioInput };