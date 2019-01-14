## 搭建个人动态备忘录:

* 1、动态添加备忘录内容，保存后生效；
* 2、按规定时间提醒，并提示相关内容；[window.notifications]
* 3、提醒类型：
    * 每天按设定的时间节点提醒；     [Once_A_Day]   例如“打卡”
    * 只到规定日期时间点提醒一次；   [Once]         例如“会议”
    * 每周按设定的时间节点提示；     [Once_A_Week]  例如“周报”
    * 周期性日期，每天提示一次；   [Once_A_Day_On_Duration]  例如“房租”  期间


### 安装依赖
```
客户端 npm install
服务端 cd server
 npm install
```

### 客户端打包
```
   npm run 
```

### 本地启动nodejs长运行脚本
```
 cd server
  npm run product  // 采用PM2管理
```
