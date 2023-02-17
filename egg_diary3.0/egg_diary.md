# egg_diary

**这是一款记事类微信小程序，前端采用html原生三件套，后端服务器采用微信云开发。**

**主要功能有记事、按时间四象限记事、抽奖（可更换记事背景）、个人登录、个人记事以及个人记事详情页**

* 需要在云数据库中创建三个数据表

1. users表

​        用于保存用户登录后的个人信息

![img](https://wdd-images-1310648928.cos.ap-guangzhou.myqcloud.com/typora/clip_image002.jpg)

​                                                                           **表1 用户个人信息表**

2. matter表

​       用于保存用户的个人记事

![img](https://wdd-images-1310648928.cos.ap-guangzhou.myqcloud.com/typora/clip_image004.jpg)

​                                                                             **表2 用户个人记事表**

3. timeManag表

​    用于保存用户的个人时间管理

![img](https://wdd-images-1310648928.cos.ap-guangzhou.myqcloud.com/typora/clip_image006.jpg)

​                                                                      **表3 用户个人时间管理表**

* 需要上传代码中的云函数，右键点击云函数文件夹—上传依赖

* 修改成自己的appid和envid（即云环境的id）

  <img src="https://wdd-images-1310648928.cos.ap-guangzhou.myqcloud.com/typora/image-20230211161629584.png" alt="image-20230211161629584" style="zoom:67%;" />

* 效果图

  ​                             <img src="https://wdd-images-1310648928.cos.ap-guangzhou.myqcloud.com/typora/image-20230211161827847.png" alt="image-20230211161827847" style="zoom:50%;" />                                 <img src="https://wdd-images-1310648928.cos.ap-guangzhou.myqcloud.com/typora/image-20230211162016056.png" alt="image-20230211162016056" style="zoom:50%;" />

​                                     <img src="https://wdd-images-1310648928.cos.ap-guangzhou.myqcloud.com/typora/image-20230211162042685.png" alt="image-20230211162042685" style="zoom:50%;" />                                 <img src="https://wdd-images-1310648928.cos.ap-guangzhou.myqcloud.com/typora/image-20230211162155633.png" alt="image-20230211162155633" style="zoom:50%;" />