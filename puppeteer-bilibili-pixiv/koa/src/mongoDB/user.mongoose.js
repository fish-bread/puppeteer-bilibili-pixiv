const mongoose = require('mongoose')
const { Schema } = mongoose
const db = mongoose.createConnection('mongodb://127.0.0.1:27017/users',{
});
db.on('connected', (err) => {
    if(err) {
        console.log('users数据库连接失败'+err);
    }
    else {
        console.log('连接users数据库成功')
    }
});
const UserSchema = new Schema({
    user_name: String,
    headshot: {type: String, default: '/userHeadshot/2.jpg'},
    email: String,
    password: String,
    uid: { type:Number, unique: true, required: true },
    background: {
        num: {type: Number,default: 0},
        placeholder: {type: String, default: '#757575'},
        color: {type: String, default: '#000000'},
        backgroundColor: {type: String, default: 'linear-gradient(to bottom, #f8ebe4, #f1f1f1)'},
    },
    //签到信息
    checkIn: {
        streak: { type: Number, default: 0 }, // 连续签到天数
        lastCheckInDate: { type: Date, default: null }, // 上次签到日期
        totalDays: { type: Number, default: 0 }, // 签到总天数
    },
    user_cookies: {
        bilibiliCookie: { type: String, default: null },
        pixivCookie: { type: String, default: null },
    }
})
const userModel = db.model('user', UserSchema, 'user')
module.exports = userModel;