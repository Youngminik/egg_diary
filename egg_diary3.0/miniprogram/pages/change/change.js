// pages/change/change.js
var app = getApp();
wx.db = wx.cloud.database();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        ownIntro: ''
    },
    //输入简介
    inputIntro(e) {
        this.setData({
            ownIntro: e.detail.value
        })
    },
    //加载个人简介
    async loadOwnIntro() {
        let that = this;
        await wx.db.collection('users').where({
            _openid: app.globalData.openid
        }).field({
            ownIntro: true
        }).get().then(res => {
            console.log(res);
            that.setData({
                ownIntro: res.data[0].ownIntro
            })
        })
    },
    //修改个人简介
    async publishOwnIntro() {
        let ownIntro = this.data.ownIntro;
        let that = this;
        if (ownIntro == '') {
            wx.showToast({
                title: '自我介绍为空哦~',
                icon: 'none',
                duration: 1500
            })
        } else {
            await wx.db.collection('users').where({
                _openid: app.globalData.openid
            }).update({
                data: {
                    ownIntro: ownIntro
                }
            }).then(res => {
                console.log(res)
                if(res.errMsg=='collection.update:ok'){
                    wx.showToast({
                        title: '提交完成~',
                        icon: 'none',
                        duration: 1500
                    });
                    //延时返回
                    setTimeout(function () {
                         wx.navigateBack()
                    },1500)
                }

            })
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        //加载个人简介
        this.loadOwnIntro();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

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