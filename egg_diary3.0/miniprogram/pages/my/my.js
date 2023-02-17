 var app = getApp();
 wx.db = wx.cloud.database();
 Page({

     /**
      * 页面的初始数据
      */
     data: {
         UserLogin: false,
         userInfo: null,
         matter:'',
         timeManag:'',
         ownIntro:''
     },

     /**
      * 生命周期函数--监听页面加载
      */
     onLoad: function (options) {},

     /**
      * 生命周期函数--监听页面初次渲染完成
      */
     onReady: function () {},

     /**
      * 生命周期函数--监听页面显示
      */
     onShow: function () {
         app.isLogin() // 全局变量
         this.setData({
             UserLogin: app.globalData.UserLogin,
             userInfo: app.globalData.userInfo
         });

         //底部tabbar index：selected
         if (typeof this.getTabBar === 'function' && this.getTabBar()) {
             this.getTabBar().setData({
                 index: 3
             })
         }
         //页面数据加载
         wx.showLoading({
             title: '数据加载中...',
         });
         //加载记事
         this.loadMatter();
         //加载时间管理
         this.loadTime();
         //加载个人简介
         if(this.data.UserLogin==true){
            this.loadOwnIntro();
         }
         //隐藏加载页面
        // wx.hideLoading();
         setTimeout(function () {
             wx.hideLoading()
         }, 1000)


     },
     //跳转到时间管理详情页
     toTimeDetail(e){
         let id=e.currentTarget.dataset.id;
         wx.navigateTo({
             url:'/pages/mytimeManag/mytimeManag?id='+id
         })
     },
     //跳转到记事详情页
     toRecordDetail(e){
        let id=e.currentTarget.dataset.id;
        wx.navigateTo({
            url:'/pages/myrecord/myrecord?id='+id
        })
     },
     //个人简介
     async loadOwnIntro(){
         let that=this;
       await wx.db.collection('users').where({
           _openid:app.globalData.openid
       }).field({
           ownIntro:true
       }).get().then(res=>{
           console.log(res);
           if(typeof(res.data[0].ownIntro)!='undefined'){
            that.setData({
                ownIntro:res.data[0].ownIntro
            })
           } 
       })
     },
     //作品--时间管理
     async loadTime() {
         await wx.cloud.callFunction({
             name: 'getTimeManag',
             data: {
                 openid: app.globalData.openid
             },
             success: res => {
                 //  console.log(res.result.data)
                 this.setData({
                     timeManag:res.result.data
                 })
             }
         })
     },
     //作品--记事
     async loadMatter() {
         await wx.cloud.callFunction({
             name: 'getMatter',
             data: {
                 _openid: app.globalData.openid
             },
             success: res => {
               //  console.log(res.result.data)
                 this.setData({
                     matter:res.result.data
                 })
             }
         })
     },
     //跳转到自我介绍
     change() {
         if(this.data.UserLogin==false) {
             wx.showToast({
                 title:'请先登录^-^',
                 icon:'none',
                 duration:1500
             })
         }
        else {
            wx.navigateTo({
                 url: '../change/change',
             })
         }
     },
     //获取用户信息
     getUserProfile() {
         if (this.data.UserLogin == true) return;
         let openId = app.globalData.openid
         //console.log('全局的openid', openId)
         wx.getUserProfile({
             desc: '用于展示个人信息', //声明获取用户信息的用途
             success: (res) => {
                 //console.log('点击获取用户信息成功', res.userInfo)
                 let userInfo = res.userInfo
                 wx.db.collection('users').where({
                     '_openid': openId
                 }).get({
                     success: res => {
                         console.log(res.data)
                         if (res.errMsg == "collection.get:ok" && res.data.length == 0) {  
                            wx.db.collection('users') // 把用户信息写入数据库的用户表
                                 .add({
                                     data: {
                                         avatarUrl: userInfo.avatarUrl,
                                         nickName: userInfo.nickName
                                     },
                                     success: res => {
                                         console.log('写入成功', res.errMsg)
                                         if (res.errMsg == "collection.add:ok") {
                                             wx.setStorageSync('UserInfo', userInfo) //保存用户信息保存到本地缓存
                                             this.setData({
                                                 userInfo: userInfo,
                                                 UserLogin: true,
                                             })
                                             wx.showToast({
                                                 title: '恭喜,登录成功',
                                                 icon: "success",
                                                 duration: 1000,
                                             })
                                         } else {
                                             // 提示网络错误
                                             wx.showToast({
                                                 title: '登录失败，请检查网络后重试！',
                                                 icon: 'none',
                                                 duration: 1000,
                                             })
                                         }
                                     },
                                     fail: err => {
                                         console.log('用户信息写入失败', err)
                                         // 提示网络错误
                                         wx.showToast({
                                             title: '登录失败，请检查网络后重试！',
                                             icon: 'none',
                                             duration: 1000,
                                         })
                                     }
                                 })
                         } else {
                             //console.log('走else-1,数据库里已存有用户信息,直接登录，不用写入数据库')
                             wx.setStorageSync('UserInfo', userInfo) //保存用户信息保存到本地缓存
                             this.setData({
                                 userInfo: userInfo,
                                 UserLogin: true
                             })
                             //更新全局状态
                             app.globalData({
                                 userInfo: userInfo,
                                 UserLogin: true,
                             })
                         }
                     },
                     fail: err => {
                         console.log('根据全局openid查询用户表失败', err)
                         // 提示网络错误
                         wx.showToast({
                             title: '网络错误！获取授权信息失败',
                             icon: 'none',
                             duration: 1000,
                         })
                     }
                 })
             },
             fail: err => {
                 console.log('用户信息获取失败', err)
                 // 提示网络错误
                 wx.showToast({
                     title: '网络错误！获取授权信息失败',
                     icon: 'none',
                     duration: 1000,
                 })
             }
         })
     },


     // 清除数据退出
     exit() {
         let that = this;
         wx.showModal({
             title: '确认退出登录？',
             showCancel: true, // 是否显示取消按钮，默认true
             cancelText: "取消", // 取消按钮的文字，最多4个字符
             cancelColor: "#000000", // 取消按钮的文字颜色，必须是16进制格式的颜色字符串
             confirmText: "确定", // 确认按钮的文字，最多4个字符
             confirmColor: "#576B95", // 确认按钮的文字颜色，必须是 16 进制格式的颜色字符串
             success(res) {
                 let UserLogin = that.data.UserLogin
                 if (res.confirm) {

                     if (UserLogin) {
                         wx.showToast({
                             title: '退出成功',
                             icon: 'success',
                             duration: 3000,
                         })
                         that.setData({
                             UserLogin: false,
                         })
                         wx.removeStorageSync('UserInfo');
                     } else {
                         // 提示登录
                         wx.showToast({
                             title: '你还未登录，请先登录！',
                             icon: 'none',
                             duration: 3000,
                         })
                     }
                     console.log('用户点击确定')
                 } else if (res.cancel) {
                     if (UserLogin) {
                         // 提示登录
                         wx.showToast({
                             title: '取消退出~',
                             icon: 'none',
                             duration: 3000,
                         })
                     } else {
                         // 提示登录
                         wx.showToast({
                             title: '你还未登录，请先登录！',
                             icon: 'none',
                             duration: 3000,
                         })
                     }
                 }
             }
         })
     },
 })