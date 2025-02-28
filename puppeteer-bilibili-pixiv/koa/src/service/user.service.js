const userModel = require('../mongoDB/user.mongoose.js')
let newUid = 10000000000;
let defaultName = '用户';
class UserService {
    //创建用户
    async createUser(email,password) {
        const maxUid = await userModel.findOne().sort({uid:-1}).exec()
        console.log('查询最大uid为',maxUid.uid)
        if (maxUid.uid){
            newUid = maxUid.uid + 1
        }
        const user =new userModel(
            {user_name: defaultName + newUid, email: email, password: password, uid:newUid}
        )
        await user.save()
        console.log('执行创建');
        return user
    }
    //删除用户
    async deleteUser(userUid) {
        const search = new UserService()
        const user = await search.searchUserUid(userUid);// 使用 searchUserUid 查找用户
        if (!user) {
            return { message: '用户不存在' };  // 如果没有找到用户，返回错误信息
        } else {
            const result = await userModel.deleteOne({uid: userUid},{});
            if (result.deletedCount === 0) {
                return {success: false, message: '未找到用户或用户已删除'};
            }
            return {success: true, message: '用户删除成功'};
        }
    }
    //通过邮箱查找用户
    async searchUser(email) {
        const findOk = await userModel.findOne({email: email,},{},{})
        if (findOk) {
            const { user_name, password, uid, headshot, background, checkIn } = findOk
            console.log('用户查找成功', 'username:', user_name, 'uid:', uid, 'headshot:', headshot, 'background:' , background );
            return { user_name, password, uid, headshot,background, checkIn }
        } else {
            return undefined
        }
    }
    //通过uid查找用户
    async searchUserUid(userUid) {
        const uidOk = await userModel.findOne({uid: userUid}, {}, {})
        if (uidOk) {
            const { uid, user_name, email, headshot, background, checkIn, user_cookies } = uidOk
            console.log('用户查找成功', 'username:', user_name, 'uid:', uid, 'headshot:', headshot, 'user_cookies:', user_cookies);
            console.log('执行uid查询', uidOk)
            return { uid, user_name, email, headshot, background, checkIn, user_cookies }
        } else {
            console.log('未找到用户')
            return ''
        }
    }
    //查询用户背景
    async searchUserBackground(userUid) {
        const uidOk = await userModel.findOne({uid: userUid}, {}, {})
        if (uidOk) {
            return uidOk.background
        }
    }
    //更改用户名字
    async changeUser(userNewName, userUid ) {
        const search = new UserService()
        const user = await search.searchUserUid(userUid);  // 使用 searchUserUid 查找用户
        if (!user) {
            return { error: '用户不存在' };  // 如果没有找到用户，返回错误信息
        }
        // 如果找到了用户，更新用户名
        const updatedUser = await userModel.findOneAndUpdate(
            { uid: userUid },  // 查找条件
            { user_name: userNewName },  // 更新的字段
            { new: true }  // 返回更新后的文档
        );
        if (updatedUser) {
            console.log('用户名更新成功', updatedUser);
            return { userNewName: updatedUser.user_name, userNewUid: userUid };  // 返回更新后的用户名
        } else {
            return { error: '更新失败' };  // 如果更新失败，返回错误信息
        }
    }
    //更改用户密码
    async changeUserPassword(userNewPassword, userUid) {
        const search = new UserService()
        const user = await search.searchUserUid(userUid)
        if (!user) {
            return { error: '用户不存在' };  // 如果没有找到用户，返回错误信息
        }
        // 如果找到了用户，更新用户密码
        const updatedUser = await userModel.findOneAndUpdate(
            { uid: userUid },  // 查找条件
            { password: userNewPassword },  // 更新的字段
            { new: true }  // 返回更新后的文档
        );
        if (updatedUser) {
            console.log('用户密码更新成功', updatedUser);
            return { userNewUid: userUid };  // 返回更新后的用户Uid
        } else {
            return { error: '更新失败' };  // 如果更新失败，返回错误信息
        }
    }
    //更改用户头像图片路径
    async changeUserHeadshot(userNewHeadshot , userUid) {
        const search = new UserService()
        const user = await search.searchUserUid(userUid)
        if (!user) {
            return { error: '用户不存在' };  // 如果没有找到用户，返回错误信息
        }
        // 如果找到了用户，更新用户图片路径
        const updatedUser = await userModel.findOneAndUpdate(
            { uid: userUid },  // 查找条件
            { headshot: userNewHeadshot },  // 更新的字段
            { new: true }  // 返回更新后的文档
        );
        if (updatedUser) {
            console.log('用户图片路径更新成功', updatedUser);
            return { userNewUid: userUid, imageUrl: userNewHeadshot };  // 返回更新后的用户Uid
        } else {
            return { error: '更新失败' };  // 如果更新失败，返回错误信息
        }
    }
    //更改用户背景
    async changeUserBackground(userNewBackground , userUid) {
        const search = new UserService()
        const user = await search.searchUserUid(userUid)
        if (!user) {
            return { error: '用户不存在' };  // 如果没有找到用户，返回错误信息
        }
        if (userNewBackground === 0) {
            // 如果找到了用户，更新用户图片路径
            const updatedUser = await userModel.findOneAndUpdate(
                { uid: userUid },  // 查找条件
                { background: {
                        num: userNewBackground,
                        placeholder: '#757575',
                        color:'#000000',
                        backgroundColor: 'linear-gradient(to bottom, #f8ebe4, #f1f1f1)'
                    }},  // 更新的字段
                { new: true }  // 返回更新后的文档
            );
            if (updatedUser) {
                return updatedUser;  // 返回更新后的用户Uid
            } else {
                return { error: '更新失败' };  // 如果更新失败，返回错误信息
            }
        } else if (userNewBackground === 1) {
            // 如果找到了用户，更新用户图片路径
            const updatedUser = await userModel.findOneAndUpdate(
                { uid: userUid },  // 查找条件
                { background: {
                        num: userNewBackground,
                        placeholder: '#f1f1f1',
                        color:'#f1f1f1',
                        backgroundColor: 'linear-gradient(to bottom, #6e4c3c, #13131a)'
                    }},  // 更新的字段
                { new: true }  // 返回更新后的文档
            );
            if (updatedUser) {
                console.log('用户背景更新成功', updatedUser);
                return updatedUser;  // 返回更新后的用户背景
            } else {
                return { error: '更新失败' };  // 如果更新失败，返回错误信息
            }
        }
    }
    //自定义用户背景
    async changeUserBackgroundImg(userNewBackground , userUid) {
        const search = new UserService()
        const user = await search.searchUserUid(userUid)
        if (!user) {
            return {error: '用户不存在'};  // 如果没有找到用户，返回错误信息
        }
        // 如果找到了用户，更新用户图片路径
        const updatedUser = await userModel.findOneAndUpdate(
            {uid: userUid},  // 查找条件
            {
                $set:{"background.backgroundColor": `url(http://localhost:3000${userNewBackground}?t=${Date.now()}) no-repeat center / cover`}
            },  // 更新的字段
            {new: true}  // 返回更新后的文档
        );
        if (updatedUser) {
            console.log('用户背景更新成功', updatedUser);
            return updatedUser;  // 返回更新后的用户Uid
        } else {
            return {error: '更新失败'};// 如果更新失败，返回错误信息
        }
    }
    //用户签到
    async changeUserCheckIn(userUid, streak, today) {
        // 使用 findOneAndUpdate 原子操作更新数据，并返回更新后的文档
        const updatedUser = await userModel.findOneAndUpdate(
            { uid: userUid },
            {
                $inc: { 'checkIn.totalDays': 1 }, // 使用 $inc 原子地增加 totalDays
                'checkIn.streak': streak,
                'checkIn.lastCheckInDate': today,
            },
            { new: true } // 返回更新后的文档
        );
        if(!updatedUser){ //检查更新是否成功
            console.log('用户不存在')
            return ''
        } else {
            return {
                checkIn: updatedUser.checkIn,
            }
        }
    }
    //更新cookies
    async  uploadUserBilibiliCookie(userUid, bilibiliCookie) {
        const uploadCookie = await userModel.findOneAndUpdate(
            { uid: userUid },
            {
                $set: { "user_cookies.bilibiliCookie": bilibiliCookie }
            },
            { new: true } // 返回更新后的文档
        ) 
        return uploadCookie. user_cookies
    }
    async uploadUserPixivCookie(userUid, pixivCookie) {
        const uploadCookie = await userModel.findOneAndUpdate(
            { uid: userUid },
            {
                $set: {"user_cookies.pixivCookie": pixivCookie }
            },
            { new: true } // 返回更新后的文档
        )
        return uploadCookie. user_cookies
    }
}
module.exports =new UserService;