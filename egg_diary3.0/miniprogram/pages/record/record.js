// pages/record/record.js
const app =  getApp();

  
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:'',
    context:'',
    tempData:''

  },

  //标题
  inputTitle(e) {
   // console.log(e.detail); 
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
  //内容
  inputContext(e){
    let context=e.detail.value;
    //console.log(context);
    if(e.detail.cursor==500){
        wx.showToast({
          title: '记事限制在500个字以内',
          icon:"none",
          duration:1500
        })
    }
    this.setData({
      context:context
    })
  },

  //提交
  async publish(){
    let title=this.data.title;
    let context=this.data.context;
    let that=this;
    if(title==""){
      wx.showToast({
        title: '还没有标题~',
        icon: 'none',
        duration:1500
      })
    }
    else if(context==""){
      wx.showToast({
        title:'请输入内容~',
        icon:'none',
        duration:2000
      })
    }
    else{
     // console.log(title+":"+context);
      const matter={
        _openid:app.globalData.openid,
        title:title,
        context:context,
        bgSrc:'../image/yz/yz-3.png'
      };
      let res=await wx.cloud.callFunction({
        name:'insertMatter',
        data:matter,
        success: res=>{
          console.log(res);
          if(res.errMsg=="cloud.callFunction:ok"){
            that.setData({
              title: '',
              context: ''
            })
            wx.showToast({
              title:'提交成功^-^',
              icon:"success",
              duration:1500
            })
            console.log(that.data.title)
            // this.onLoad();
          }
        }
      })
    }
  },
  /**
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
  onShow: function () {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        index: 1
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

   
})