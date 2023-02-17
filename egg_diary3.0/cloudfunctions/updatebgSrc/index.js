// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
    console.log(event.matter.matterId)
    try {
        return await db.collection('matter').doc(event.matter.matterId)
            .update({
                data:{
                    bgSrc:event.matter.src
                }
            })
    } catch (e) {
        console.error(e)
    }
}