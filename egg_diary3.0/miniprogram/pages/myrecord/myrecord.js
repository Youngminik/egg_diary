// pages/myrecord/myrecord.js

var app = getApp()
wx.db = wx.cloud.database();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        bgSrc:'',
        matter: {
            bgSrc:''
        },
        countRecord: 0,
        index: '',
        matterId: '',
        canvasHidden:true
    },
    checkauth() {  //检测用户是否有写入图片到相册的权限， 如果没有， 就向用户请求这一权限
        wx.getSetting({
            withSubscriptions: true,
            success(res) {
                console.log(res.authSetting)
                if (res.authSetting["scope.writePhotosAlbum"] && res.authSetting["scope.writePhotosAlbum"] === true) {
                } else {
                    wx.showModal({
                      title: '需要获取图片权限',
                      success(res){
                          if(res.confirm){
                            wx.authorize({
                                scope: 'scope.writePhotosAlbum',
                                success() {
                                }
                            })
                          }
                      }
                    })
                    
                }
            }
        });
    },

    
    //文本换行 参数：1、canvas对象，2、文本 3、距离左侧的距离 4、距离顶部的距离 5、6、文本的宽度
    drawText: function(ctx, str, leftWidth, initHeight, titleHeight, canvasWidth) {
        var lineWidth = 0;
        var lastSubStrIndex = 0; //每次开始截取的字符串的索引
        for (let i = 0; i < str.length; i++) {
            lineWidth += ctx.measureText(str[i]).width;
            if (lineWidth > canvasWidth) {
                ctx.fillText(str.substring(lastSubStrIndex, i), leftWidth, initHeight); //绘制截取部分
                initHeight += 42; //字体的高度
                lineWidth = 0;
                lastSubStrIndex = i;
                titleHeight += 30;
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
       // this.checkauth();
        let that = this;
        const query = wx.createSelectorQuery();
        query.select("#canvas").fields({node: true, size: true}).exec(res => {
            console.log(res);
            const canvas = res[0].node;
            canvas.width = 375;
            canvas.height = 721;				//自定义一下画布的大小
            const ctx = canvas.getContext("2d");
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, 375, 721);		//设置一下背景的填充

            //const BG=canvas.createImage();
            const bg = canvas.createImage();
            bg.src = that.data.matter.bgSrc;   //this.data.detail.imagesrc 这是一个网络图片的地址 
            bg.onload = () => {
                console.log(bg);
                console.log(bg.width);
                console.log(bg.height);
                //这里把图片等比缩小
                const height = bg.height * 375 / bg.width;   

                //绘制文字
                let firstline = this.data.matter.title;    
                let secondline = this.data.matter.context;    
                ctx.fillStyle = '#000';
                ctx.font = "30px 宋体";

                ctx.fillText(firstline, (375 - ctx.measureText(firstline).width) / 2, 50);
               // ctx.fillText(secondline, 20, 90);
               ctx.fillStyle = '#000';
                ctx.font = "25px 宋体";
               that.drawText(ctx,secondline,24, 104, 300, 300);

                ctx.fill();
               // ctx.drawImage(BG,0,0,width,height);
                ctx.drawImage(bg, 0, 250, 375, 295)       //画图片
                 

                setTimeout(() => {
                    wx.canvasToTempFilePath({  //小程序的把canvas 转图片的方法
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
                                fail(err){
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
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        let id = options.id;
        this.setData({
            matterId: id
        })
        //console.log(id);
        await this.loadMatterDetail(id);

    },
   
    //抽奖
    onLucky() {
        wx.navigateTo({
            url: '../chou/chou'
        })
        // let countRecord = this.data.countRecord;
        // // Number(countRecord)
        // // console.log( countRecord)
        // //   console.log(parseInt(countRecord))
        // //   console.log(countRecord<5)
        // if (countRecord < 5) {
        //     wx.navigateTo({
        //         url: '../chou/chou'
        //     })
        // } else {
        //     wx.showToast({
        //         title: '您的记事超过五篇，已经解锁全部记事背景图啦',
        //         icon: 'none',
        //         duration: 1500
        //     })
        // }
    },
    //删除记事
    onDelete(event) {
        //console.log(event.currentTarget.dataset.id);
        let matterId = event.currentTarget.dataset.id;
        let that = this;
        wx.showModal({
            title: "提示",
            content: "确认删除？",
            success(res) {
                if (res.confirm) {
                    wx.cloud.callFunction({
                        name: "deleteMatter",
                        data: {
                            matterId: matterId
                        },
                        success: res => {
                            wx.showToast({
                                title: '删除成功',
                                icon: 'success',
                                duration: 1500
                            });
                            //待弹出框显示之后再返回，延时
                            setTimeout(function () {
                                wx.navigateBack()
                            }, 2000)
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
                        title: '继续保留该记事~',
                        icon: 'none',
                        duration: 1500
                    })
                }
            }

        })
    },
    //加载记事详情
    async loadMatterDetail(id) {
        let that = this;
        await wx.db.collection('matter').where({
            _id: id
        }).get().then(res => {
            // console.log(res.data);
            that.setData({
                matter: res.data[0]
            })
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
    async onShow() {
        // //查询当前用户发表的记事数量
        // let data = await wx.db.collection('matter').where({
        //     openid: app.globalData.openid
        // }).count();
        // // console.log(data.total)
        // this.setData({
        //     countRecord: data.total
        // })
        
         //底部tabbar index：selected
         if (typeof this.getTabBar === 'function' && this.getTabBar()) {
            this.getTabBar().setData({
                index: 3
            })
        }

        //抽奖重新更新当前背景图
        if(this.data.bgSrc!=''){
            let bgSrc=this.data.bgSrc;
            this.setData({
               'matter.bgSrc':bgSrc
            })
            this.updatebgSrc();
           // console.log(this.data.matter.bgSrc)
        }
        this.uploadbgSrc();
    },
    async uploadbgSrc() {
        let that=this;
        let matterId = this.data.matterId;
        //console.log(matterId)
        let bgSrc = this.data.bgSrc;
        //查询当前记事的背景图
        return await wx.db.collection('matter').where({
            _id: matterId
        }).field({
            bgSrc: true
        }).get().then(res => {
            console.log(res);
            that.setData({
                bgSrc: res.data.bgSrc
            })
        })
    },
    async updatebgSrc() {
        let matterId = this.data.matterId;
        let bgSrc = this.data.matter.bgSrc;
        //更新当前记事的地址
        return await wx.db.collection('matter'). where({
            _id:matterId,
            _openid:app.globalData.openid
        }).update({
            data: {
               bgSrc: bgSrc
            }
        }).then(res => {
            console.log(res)
        })
    }
})