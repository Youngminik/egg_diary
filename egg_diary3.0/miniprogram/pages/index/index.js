// pages/index/index.js
var util = require('../../utils/util')
var app= getApp();
const db = wx.cloud.database()
  
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Time: '', //实时效果
    motto: 'Hello World',
    userInfo: null,
    UserLogin: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName') // 如需尝试获取用户信息可改为false
  },
  //跳转到时间管理四象限
//   time() {
//     wx.navigateTo({
//       url: '../time/time',
//     })
//   },
   //获取用户信息
   getUserProfile() {
       console.log(this.data.UserLogin)
    if(this.data.UserLogin==true) return;
    let openId = app.globalData.openid
    //console.log('全局的openid', openId)
    wx.getUserProfile({
        desc: '用于展示个人信息', //声明获取用户信息的用途
        success: (res) => {
            //console.log('点击获取用户信息成功', res.userInfo)
            let userInfo = res.userInfo
            db.collection('users').where({
                '_openid': openId
            }).get({
                success: res => {
                    console.log('根据全局openid查询用户表成功', res.data)
                    if (res.errMsg == "collection.get:ok" && res.data.length == 0) { //length等于0，证明没有该用户
                        db.collection('users') // 把用户信息写入数据库的用户表
                            .add({
                                data: {
                                    avatarUrl: userInfo.avatarUrl,
                                    nickName: userInfo.nickName 
                                },
                                success: res => {
                                   // console.log('写入成功', res.errMsg)
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
  //首页实时效果
  getTime: function (e) {
    let currentTime = util.formatTime(new Date());
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this;
    setInterval(function () {
      that.setData({
        Time: util.formatTime(new Date())
      });
    }, 1000);
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */

  onShow: function () {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        index: 0
      })
    };
    app.isLogin();//判断是否登录
    this.setData({
      UserLogin: app.globalData.UserLogin,
      userInfo: app.globalData.userInfo
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})