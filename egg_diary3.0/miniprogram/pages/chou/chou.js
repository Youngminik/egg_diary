var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        BGColor: [{
            color: "linear-gradient(10deg, #F5F3E3, #F0EEE0);"
        },
            {
                color: "linear-gradient(10deg, #F5F3E3, #F0EEE0);"
            },
            {
                color: "linear-gradient(10deg, #F5F3E3, #F0EEE0);"
            },
            {
                color: "linear-gradient(10deg, #F5F3E3, #F0EEE0);"
            },
            {
                color: "linear-gradient(10deg, #F5F3E3, #F0EEE0);"
            },
            {
                color: "linear-gradient(10deg, #F5F3E3, #F0EEE0);"
            },
            {
                color: "linear-gradient(10deg, #F5F3E3, #F0EEE0);"
            },
            {
                color: "linear-gradient(10deg, #F5F3E3, #F0EEE0);"
            },
            {
                color: "linear-gradient(10deg, #F5F3E3, #F0EEE0);"
            },
        ],
        Position: [{
            top: "15rpx",
            left: "15rpx",
            PC: "",
            PC1: "contin0",
            FZ: "",
            TIF: true
        },
            {
                top: "15rpx",
                left: "210rpx",
                PC: "",
                PC1: "contin1",
                FZ: "",
                TIF: true
            },
            {
                top: "15rpx",
                left: "405rpx",
                PC: "",
                PC1: "contin2",
                FZ: "",
                TIF: true
            },
            {
                top: "210rpx",
                left: "15rpx",
                PC: "",
                PC1: "contin3",
                FZ: "",
                TIF: true
            },
            {
                top: "210rpx",
                left: "210rpx",
                PC: "",
                PC1: "contin4",
                FZ: "",
                TIF: true
            },
            {
                top: "210rpx",
                left: "405rpx",
                PC: "",
                PC1: "contin5",
                FZ: "",
                TIF: true
            },
            {
                top: "405rpx",
                left: "15rpx",
                PC: "",
                PC1: "contin6",
                FZ: "",
                TIF: true
            },
            {
                top: "405rpx",
                left: "210rpx",
                PC: "",
                PC1: "contin7",
                FZ: "",
                TIF: true
            },
            {
                top: "405rpx",
                left: "405rpx",
                PC: "",
                PC1: "contin8",
                FZ: "",
                TIF: true
            },
        ],
        Present: [{
            src: "../image/yz/yz-1.png",
            flag: false,
            IF: false
        },
            {
                src: "../image/yz/yz-2.png",
                flag: false,
                IF: false
            },
            {
                src: "../image/yz/yz-3.png",
                flag: false,
                IF: false
            },
            {
                src: "../image/yz/yz-4.png",
                flag: false,
                IF: false
            },
            {
                src: "../image/yz/yz-5.png",
                flag: false,
                IF: false
            },
            {
                src: "../image/yz/yz-6.png",
                flag: false,
                IF: false
            },
            {
                src: "../image/yz/yz-7.png",
                flag: false,
                IF: false
            },
            {
                src: "../image/yz/yz-8.png",
                flag: false,
                IF: false
            },
            {
                src: "../image/yz/yz-9.png",
                flag: false,
                IF: false
            },
        ],
        Flag: false, //标志位，表示还未开始翻牌
        times: 1000, //当前抽奖次数
        MyPrices: [], //获得的奖品
        NowPresent: [], //每张票背后的奖品（重新发牌后）
        MyPrices_Box: false,
        RSB1: "#ffffff", //"重新发牌"默认颜色
        RST1: "#afa493"
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //获取全局的翻牌次数以及获奖记录
        this.setData({
            // times: app.globalData.Times,
            MyPrices: app.globalData.MyPrices,
            NowPresent: this.data.Present
        })

        //打乱奖品
        var a = []
        for (let i = 0; i < 9; i++) {
            let flag = true;
            let num = -1;
            while (flag) {
                num = parseInt(Math.random() * 9);
                if (this.data.Present[num].flag == false) {
                    var S = this.data.Present[num];
                    a.push(S);
                    flag = false;
                    var temp = "Present[" + num + "].flag";
                    this.setData({
                        [temp]: true
                    })
                }
            }
        }
        //console.log(a)
        this.setData({
            NowPresent: a
        })
        for (let i = 0; i < 9; i++) {
            var temp = "Present[" + i + "].flag";
            this.setData({
                [temp]: false
            })
        }
    },


    ReStartCard() {
        for (let i = 0; i < 9; i++) //初始化
        {
            var T1 = "Position[" + i + "].FZ";
            var T2 = "BGColor[" + i + "].color";
            var T3 = "Position[" + i + "].TIF";
            var T4 = "NowPresent[" + i + "].IF";
            this.setData({
                [T1]: "",
                [T2]: "linear-gradient(10deg, #F5F3E3, #F0EEE0)",
                [T3]: true,
                [T4]: false
            })
        }
        this.setData({
            Flag: false
        })
        var that = this;
        this.setData({
            RSB1: "#ffffff", //点击“重新翻牌”按钮时的颜色REB1为底色，2为字的颜色
            RST1: "#afa493"
        })
        for (let i = 0; i < 9; i++) {
            var temp = "Position[" + i + "].PC";
            var S = this.data.Position[i].PC1;
            this.setData({
                [temp]: S,
            })
        }
        setTimeout(function () {
            that.setData({
                RSB1: "#ffffff", //重新翻牌后“重新翻牌”的颜色
                RST1: "#afa493"
            })
            for (let i = 0; i < 9; i++) {
                var temp = "Position[" + i + "].PC";
                that.setData({
                    [temp]: "",
                })
            }
        }, 1000)

        //打乱奖品
        var a = []
        for (let i = 0; i < 9; i++) {
            let flag = true;
            let num = -1;
            while (flag) {
                num = parseInt(Math.random() * 9);
                if (this.data.Present[num].flag == false) {
                    var S = this.data.Present[num];
                    a.push(S);
                    flag = false;
                    var temp = "Present[" + num + "].flag";
                    this.setData({
                        [temp]: true
                    })
                }
            }
        }
        this.setData({
            NowPresent: a
        })
        for (let i = 0; i < 9; i++) {
            var temp = "Present[" + i + "].flag";
            this.setData({
                [temp]: false
            })
        }
    },

    CLICKCARD(e) {
        if (this.data.Flag == true) //如果已经翻了牌
            return;
        if (this.data.times <= 0) {
            wx.showToast({
                title: '次数不足',
                icon: 'error',
                duration: 3000
            })
            return;
        }
        var TIMES = this.data.times - 1;
        this.setData({
            times: TIMES
        })
        // app.globalData.QFTimes = TIMES;
        var that = this;
        let index = e.currentTarget.dataset.id;
        var temp1 = "Position[" + index + "].FZ";
        var temp2 = "BGColor[" + index + "].color";
        var textIF = "Position[" + index + "].TIF";
        var IMAIF = "NowPresent[" + index + "].IF";

        this.setData({ //翻转选中的牌
            [temp1]: "fanzhuan",
            Flag: true
        })
        setTimeout(function () { //延时变色
            that.setData({
                [temp2]: "linear-gradient(10deg, #F5F3E3, #F0EEE0)", //翻牌后渐变颜色
                [textIF]: false
            })
        }, 800)
        setTimeout(function () { //延时显示图片
            that.setData({
                [IMAIF]: true
            })
        }, 1200)
        setTimeout(function () {
            for (let i = 0; i < 9; i++) {
                if (i != index) {
                    var temp3 = "Position[" + i + "].FZ";
                    that.setData({
                        [temp3]: "fanzhuan"
                    })
                }
            }
        }, 1300)
        setTimeout(function () {
            for (let i = 0; i < 9; i++) {
                if (i != index) {
                    var textIF2 = "Position[" + i + "].TIF"
                    var temp4 = "BGColor[" + i + "].color";
                    that.setData({
                        [temp4]: "linear-gradient(10deg, #F5F3E3, #F0EEE0);",// 翻牌后与内容的颜色
                        [textIF2]: false
                    })
                }
            }
        }, 2100),
            setTimeout(function () {
                for (let i = 0; i < 9; i++) {
                    if (i != index) {
                        var IMAIF2 = "NowPresent[" + i + "].IF";
                        that.setData({
                            [IMAIF2]: true
                        })
                    }
                }
            }, 2700)
        setTimeout(function () {
            if (that.data.NowPresent[index].text == "谢谢惠顾") {
                wx.showToast({
                    title: '很遗憾您未中奖',
                    icon: 'error',
                    duration: 3000
                })
            } else {
                wx.showToast({ //提示中奖信息
                    title: '恭喜您解锁一张新记事背景',
                    icon: 'none',
                    duration: 5000
                })
                let index = e.currentTarget.dataset.id;
                let page = getCurrentPages();
                let prePage = page[page.length - 2];
                //console.log(index)
                let  bgSrc= that.data.NowPresent[index].src
               // console.log(src)
                prePage.setData({
                    bgSrc: bgSrc
                })

                setTimeout(function () {
                    wx.navigateBack()
                }, 1000)

              //   var S = that.data.NowPresent[index].text;
              //   console.log(S)
              //   var prices = that.data.MyPrices;
              // //  prices.push(S);
              //   console.log(prices)
              //   that.setData({
              //       MyPrices: prices
              //   })
              //   app.globalData.MyPrices = prices; //更新全局变量
            }
        }, 2800)
    }
})