// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
    //console.log(event.openid)
    try {
        return await db.collection('matter').add({
            data: {
                _openid: event._openid,
                title: event.title,
                context: event.context,
                bgSrc: event.bgSrc
            }
        })
    } catch (e) {
        console.error(e)
    }
}