const app = getApp()
Component({
  data: {
    msgList: [
      { url: "url", title: "欢迎清华大学经济管理学院**协会入驻" },
      { url: "url", title: "欢迎北京大学**校友会入驻" },
      { url: "url", title: "欢迎清华五道口金融学院**校友组织入驻" },
      { url: "url", title: "欢迎长江商学院**地区校友会入驻" },
      { url: "url", title: "欢迎上海交大安泰学院**地区校友会入驻" },
      { url: "url", title: "清华经管校友王**于" + Math.floor(Math.random() * 59 + 1) + "分钟前注册" },
      { url: "url", title: "北大光华校友于**于" + Math.floor(Math.random() * 59 + 1) + "分钟前注册" },
      { url: "url", title: "剑桥校友Andy＊于" + Math.floor(Math.random() * 59 + 1) + "分钟前注册" },
      { url: "url", title: "清华五道口校友张**于" + Math.floor(Math.random() * 59 + 1) + "分钟前注册" },
      { url: "url", title: "人大商学院校友方**于" + Math.floor(Math.random() * 59 + 1) + "分钟前注册" },
      { url: "url", title: "活动版块" + Math.floor(Math.random() * 59 + 1) + "分钟前有新活动发布，请速查看" },
      { url: "url", title: "合作版块" + Math.floor(Math.random() * 59 + 1) + "分钟前有新活动发布，请速查看" },
      { url: "url", title: "课程版块" + Math.floor(Math.random() * 59 + 1) + "分钟前有新活动发布，请速查看" }, 
    ]
  },
  methods: {
    _fetchNotices() {
      const header =
        wx.request({
          url: app.globalData.cheerFishHost + 'api/notices',
          data: {},
          header: {
            'appId': app.globalData.appId,
            'userIdentity': app.globalData.userInfo ? app.globalData.userInfo.identity : 0
          },
          success: res => {
            if (res.statusCode === 200) {
              console.log(JSON.stringify(res.data))
              if (res.data.code === 10000) {
                const list = res.data.data.list
                // console.log('获取公告列表aaaaaaaaaaaa', list.slice(0, 10))
                this.setData({
                  msgList: list.slice(0, 10)
                })
              } else {
                console.log('获取公告列表失败errorCode=' + res.data.code)
              }
            } else {
              console.log('获取公告列表失败statusCode=' + res.statusCode)
            }
          },
          fail: res => {
            console.log("WX request fail")
          }
        })
    }

  }
})