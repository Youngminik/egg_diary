// pages/mytimeManag/mytimeManag.js
wx.db = wx.cloud.database();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        time: '',
        canvasHidden: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        let id = options.id;
        //console.log(id);
        await this.loadTimeDetail(id);
    },
    //删除时间管理
    onDelete(event) {
        //console.log(event.currentTarget.dataset.id);
        let timeManagId = event.currentTarget.dataset.id;
        let that = this;
        wx.showModal({
            title: "提示",
            content: "确认删除？",
            success(res) {
                if (res.confirm) {
                    wx.cloud.callFunction({
                        name: "deleteTimeManag",
                        data: {
                            timeManagId: timeManagId
                        },
                        success: res => {
                            console.log(res)
                            if (res.errMsg == 'cloud.callFunction:ok') {
                                wx.showToast({
                                    title: '删除成功',
                                    icon: 'success',
                                    duration: 1500
                                });
                                //延时返回
                                setTimeout(function () {
                                    wx.navigateBack()
                                }, 2000)
                            }
                        },
                        fail: err => {
                            wx.showToast({
                                title: '删除失败了，打程序员一顿！',
                                icon: 'none',
                                duration: 1500
                            })
                        }
                    })
                } else if (res.cancel) {
                    wx.showToast({
                        title: '继续保留该时间管理~',
                        icon: 'none'
                    })
                }
            }

        })
    },
    //加载时间管理详情
    async loadTimeDetail(id) {
        let that = this;
        console.log(id)
        await wx.db.collection('timeManag').where({
            _id: id
        }).get().then(res => {
            //console.log(res);
            that.setData({
                time: res.data[0]
            })
        })
    },
    checkauth() { //检测用户是否有写入图片到相册的权限,如果没有,就向用户请求这一权限
        wx.getSetting({
            withSubscriptions: true,
            success(res) {
                console.log(res.authSetting)

                if (res.authSetting["scope.writePhotosAlbum"] && res.authSetting["scope.writePhotosAlbum"] === true) {} else {
                    wx.authorize({
                        scope: 'scope.writePhotosAlbum',
                        success() {}
                    })
                }
            }
        });
    },
    //文本换行 参数：1、canvas对象，2、文本 3、距离左侧的距离 4、距离顶部的距离 5、6、文本的宽度
    drawText: function (ctx, str, leftWidth, initHeight, titleHeight, canvasWidth) {
        var lineWidth = 0;
        var lastSubStrIndex = 0; //每次开始截取的字符串的索引
        for (let i = 0; i < str.length; i++) {
            lineWidth += ctx.measureText(str[i]).width;
            if (lineWidth > canvasWidth) {
                ctx.fillText(str.substring(lastSubStrIndex, i), leftWidth, initHeight); //绘制截取部分
                initHeight += 30; //字体的高度
                lineWidth = 0;
                lastSubStrIndex = i;
                titleHeight += 20;
            }
            if (i == str.length - 1) { //绘制剩余部分
                ctx.fillText(str.substring(lastSubStrIndex, i + 1), leftWidth, initHeight);
            }
        }
        // 标题border-bottom 线距顶部距离
        titleHeight = titleHeight + 10;
        return titleHeight
    },
    //生成图片
    makepicture() {
        //this.checkauth();
        let that = this;
        const query = wx.createSelectorQuery();
         query.select("#canvas").fields({
            node: true,
            size: true
        }).exec(res => {
            console.log(res);
            const canvas = res[0].node;
            canvas.width = 475;
            canvas.height = 721; //自定义一下画布的大小
            const ctx = canvas.getContext("2d");
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, 375, 721); //设置一下背景的填冲


            //const BG=canvas.createImage();
            const bg = canvas.createImage();
            bg.src = "../image/record-2-bg.png"; //this.data.detail.imagesrc 这是一个网络图片的地址 
            bg.onload = () => {
                console.log(bg);
                console.log(bg.width);
                console.log(bg.height);
                //这里把图片等比缩小
                const height = bg.height * 375 / bg.width;  
                ctx.drawImage(bg, 0, 55, 375, 600)
                //绘制文字
                let title = this.data.time.title;
                let firstline = this.data.time.first;  
                let secondline = this.data.time.second;  
                let thirdline = this.data.time.third;
                let fourthline = this.data.time.fourth;
                ctx.fillStyle = '#000';
                ctx.font = "26px 宋体";

                ctx.fillText(title, (375 - ctx.measureText(title).width) / 2, 50);
                // ctx.fillText(secondline, 20, 90);
                ctx.fillStyle = '#000';
                ctx.font = "22px 宋体";
                // 1、canvas对象，2、文本 3、距离左侧的距离 4、距离顶部的距离 5、6、文本的宽度
                that.drawText(ctx, firstline, 24, 154, 330, 150);
                that.drawText(ctx, secondline, 211, 154, 330, 150);
                that.drawText(ctx, thirdline, 24, 444, 330, 150);
                that.drawText(ctx, fourthline, 211, 444, 330, 150);
                ctx.fill();
                // ctx.drawImage(BG,0,0,width,height);
                // ctx.drawImage(bg, 0, 55, 375, 600)       //画图片
                // qrcode.onload = () => {
                //     ctx.drawImage(qrcode, 280, height + 10, 90, 90)
                // }

                setTimeout(() => {
                    wx.canvasToTempFilePath({ //小程序把canvas转图片的方法
                        canvasId: "canvas",
                        canvas: canvas,
                        x: 0,
                        y: 0,
                        success(res) {
                            wx.saveImageToPhotosAlbum({
                                filePath: res.tempFilePath,
                                success(res1) {
                                    console.log(res1)
                                    wx.showToast({
                                        title: '保存成功',
                                    })
                                },
                                fail(err) {
                                    if (err.errMsg === "saveImageToPhotosAlbum:fail:auth denied" || err.errMsg === "saveImageToPhotosAlbum:fail auth deny" || err.errMsg === "saveImageToPhotosAlbum:fail authorize no response") { 
                                        wx.showModal({
                                          title: '提示',
                                          content: '需要授权保存到相册',
                                          showCancel: false,
                                          success: modalSuccess => {
                                            wx.openSetting({
                                              success(settingdata) {
                                                console.log("settingdata", settingdata)
                                                if (settingdata.authSetting['scope.writePhotosAlbum']) {
                                                  wx.showModal({
                                                    title: '提示',
                                                    content: '获取权限成功,再次点击图片即可保存',
                                                    showCancel: false,
                                                  })
                                                } else {
                                                  wx.showModal({
                                                    title: '提示',
                                                    content: '获取权限失败，将无法保存到相册哦~',
                                                    showCancel: false,
                                                  })
                                                }
                                              },
                                              fail(failData) {
                                                console.log("failData", failData)
                                              },
                                              complete(finishData) {
                                                console.log("finishData", finishData)
                                              }
                                            })
                                          }
                                        })
                                      }
                          
                                }
                            })
                        }
                    }, that)
                }, 1000)
            }
        })
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