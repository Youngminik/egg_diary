// app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      });
    }

    this.getOpenid();
  },
  globalData: {
    userInfo: null,
    UserLogin: false,
    openid:null,
  },

  // 获取用户openid
  getOpenid: function () {
    var app = this;
    var openId = wx.getStorageSync('openId');
    if (openId) {
      //console.log('本地获取openid:', openId);
      app.globalData.openid = openId;
      app.isLogin();
    } else {
      wx.cloud.callFunction({
        name: 'getOpenid',
        success(res) {
          //console.log('云函数获取openid成功', res.result.openid)
          var openId = res.result.openid;
          wx.setStorageSync('openId', openId)
          app.globalData.openid = openId;
          app.isLogin();
        },
        fail(res) {
          console.log('云函数获取openid失败', res)
        }
      })
    }
  },

  //检测是否登录函数，未登录则提示登录
  isLogin() {
    var userInfo = wx.getStorageSync('UserInfo') // 获取缓存的用户信息
    if (userInfo.nickName && userInfo.avatarUrl) {
      this.globalData.UserLogin = true
      this.globalData.userInfo = userInfo
    } else {
      this.globalData.UserLogin = false
    }
  },
});
