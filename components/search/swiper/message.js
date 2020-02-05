const app = getApp()
Component({
  data: {
    msgList: []
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
                // console.log('获取公告列表', list.slice(0, 10))
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