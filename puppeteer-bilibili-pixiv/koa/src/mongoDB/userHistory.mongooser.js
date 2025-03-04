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
    uid: { type:Number, unique: true, required: true },
    history: [{
        id: { type: String, required: true },
        historyUrl: { type: String },
        title: { type: String },
        }]
})
const userHistoryModel = db.model('userHistory', UserSchema, 'userHistory')
module.exports = userHistoryModel;