# puppeteer-bilibili-pixiv 禁止商用

puppeteer用于爬取bilibili视频及pixiv图片

## 项目描述
## Project Description:

使用puppeteer,以用户cookie为核心设计的一个爬虫软件,
依靠用户传递的cookie和bilibili视频网页链接或pixiv图片网页链接,
无需用户登录即可爬取资源

A web scraping software designed with user cookies at its core,
using cookies provided by the user along with Bilibili video page links or Pixiv image page links,
allowing resource scraping without user login.

## 使用前提

目前只确保windows系统可以使用,请确保电脑配置了node环境,其次要配置mongoDB数据库,新建一个users库,并在users库中创建user表和userHistory表,然分别对electron-vue和koa执行npm install(windows注意启用管理者身份运行)构建node_modules文件夹,然后就可以使用

如何配置mongoDB数据库,请查阅,https://blog.csdn.net/weixin_43405300/article/details/120017878

At present, only ensure that the windows system can be used, please make sure that the computer is configured with the node environment, and then configure the mongoDB database, create a new users library, and create the user table and userHistory table in the users library, and then execute npm install (windows note to enable manager identity run) to build the node_modules folder for electron-vue and koa respectively. Then you can use it,
For more information about how to configure a mongoDB database, see https://blog.csdn.net/weixin_43405300/article/details/120017878

## Npm install

```bash
$ npm install
```

### Build app
### 构建app

```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```

