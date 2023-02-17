// custom-tab-bar/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    index:0,
    tabBar:[
      {
        name:'home',
        pagePath:'/pages/index/index',
        icon:'icon-home',
        iconPath:"/pages/image/logo-big-home.png",
        selectedIconPath:'/pages/image/logo-big-home.png'
      },
      {
        name:'home',
        pagePath:'/pages/record/record',
        iconPath:'/pages/image/logo-big-record.png',
        selectedIconPath:'/pages/image/logo-low-record.png',
        icon:'icon-all',
      },
      {
        name:'time',
        pagePath: '/pages/time/time',
        iconPath: '/pages/image/logo-low-time.png',
        selectedIconPath: '/pages/image/logo-big-time.png',
    },
      {
        name:'home',
        pagePath:'/pages/my/my', 
        iconPath:'/pages/image/logo-low-my.png',
        selectedIconPath:'/pages/image/logo-big-my.png'
      },
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    goto(e){
        const data=e.currentTarget.dataset;
        const url=data.path;
        console.log(data);
        wx.switchTab({url});
        if(data.index!=this.data.index){
          this.setData({
            index:data.index
          })
        };
       // console.log(data.index)
    
      }
  }
})
