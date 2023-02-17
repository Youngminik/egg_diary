// pages/time/time.js
const app=getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        title: '',
        first: '',
        second: '',
        third: '',
        fourth: ''
    },
    //提交
    async onTimePublish() {
        let title=this.data.title;
        let first = this.data.first;
        let second = this.data.second;
        let third = this.data.third;
        let fourth = this.data.fourth;
        let that = this;
        if (title==''){
            wx.showToast({
                title:'还没有标题~',
                icon:'none',
                duration:1500
            })
        }
        else if(first==''&&second==''&&third==''&&fourth==''){
            wx.showToast({
                title:'时间四象限还没填~',
                icon:'none',
                duration:1500
            })
        }
        else{
            const timeManag= {
              openid:app.globalData.openid,
                title: title,
                first: first,
                second: second,
                third: third,
                fourth: fourth
            };
            await wx.cloud.callFunction({
                name:'insertTimeManag',
                data:timeManag,
                success:res=>{
                    if(res.errMsg=="cloud.callFunction:ok"){
                        that.setData({
                            title: '',
                            first: '',
                            second: '',
                            third: '',
                            fourth: ''
                        })
                        wx.showToast({
                            title:'提交成功^-^',
                            icon:'success',
                            duration:1500
                        })
                    }
                }
            })
        }
            },
    //标题
    oninputTitle(e) {
        if(e.detail.cursor==9){
            wx.showToast({
              title: '标题限制在9个字以内',
              icon:"none",
              duration:1500
            })
        }
        this.setData({
            title: e.detail.value
        })
    },
    //第一象限
    inputFirst(e) {
        this.setData({
            first: e.detail.value
        })
    }, //第二象限
    inputSecond(e) {
        this.setData({
            second: e.detail.value
        })
    }, //第三象限
    inputThird(e) {
        this.setData({
            third: e.detail.value
        })
    }, //第四象限
    inputFourth(e) {
        this.setData({
            fourth: e.detail.value
        })
    }, /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

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
        if (typeof this.getTabBar === 'function' && this.getTabBar()) {
            this.getTabBar().setData({
              index: 2
            })
          }
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