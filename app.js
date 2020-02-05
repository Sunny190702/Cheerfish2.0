const base64 = require('/utils/base64.js')

App({
  globalData: {

    data: [1, 2, 3],
    share: true, // 分享默认为false
    height: 0,
    navHeight: 0,
    appId: 'CFffa67738ba30a394',
    // cheerFishHost: 'https://test.hanstate.com/CheerFish/',
    // pictureHost: 'https://test.hanstate.com/CheerFishPictures/',   
    // cheerFishHost: 'http://192.168.50.72:8080/CheerFish/',
    // pictureHost: 'http://192.168.50.72:8080/CheerFishPictures/',     
    cheerFishHost: 'https://service.hanstate.com/CheerFish/',
    pictureHost: 'https://service.hanstate.com/CheerFishPictures/',
    account_level1: '0',
    account_level2: '1',
    account_level3: '2',
    systemInfo: "android",
    logined: false,
    tmplId1: '1bCbecbpD4gxQq5Jq2kSJA3xvL3Dye1VY-ooWH4k15o',
    tmplId2: 'Ppnd1Gyg69g5HkfXYccetGnYvHGN2lg3J4fu1lwOy80',
  },

  onLaunch: function(options) {
    console.log('onLaunch options.scene is ' + options.scene)
    this.getPlatform()

    /** start | init userInfo  */
    let userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.globalData.userInfo = userInfo
      wx.login({
        success: res => {
          if (res.code) {
            let bindUserModel = {
              code: res.code,
              avatarUrl: userInfo.userBaseInfo.header,
              nickName: userInfo.userBaseInfo.name,
              gender: userInfo.userBaseInfo.gender,
            }
            console.log("bindUserModel:" + JSON.stringify(bindUserModel));
            wx.request({
              url: this.globalData.cheerFishHost+'api/users',
              data: bindUserModel,
              header: {
                'Content-Type': 'application/json',
                'appId': this.globalData.appId
              },
              method: "POST",
              success: res => {
                if (res.statusCode === 200) {
                  console.log("app.js"+JSON.stringify(res.data))
                  if (res.data.code === 10000) {
                    res.data.data.userBaseInfo.header = this.globalData.pictureHost + res.data.data.userBaseInfo.header;
                    this.globalData.userInfo = res.data.data
                    wx.setStorageSync('userInfo', this.globalData.userInfo)
                  } else {
                    console.log('sync useinfo failure => api code=' + res.data.code)
                  }
                } else {
                  console.log('sync useinfo failure => net failure')
                }
              },
              fail: (error) => {
                console.log('sync useinfo failure => wx request failure')
              },
            })
          } else {
            console.log('sync userinfo failure => login failure' + res.errMsg)
          }
        },
        fail: () => {
          console.log('sync userinfo failure => login failure')
        },
      })
    }
    /** end   | add by weiqun  */



    // // 判断是否由分享进入小程序
    // if (options.scene == 1007 || options.scene == 1008) {
    //   _this.globalData.share = true
    // } else {
    //   _this.globalData.share = false
    // };

  },
  getPlatform: function() {
    const that = this
    wx.getSystemInfo({
      success: function(res) {
        that.globalData.systemInfo = res.platform
      }
    })
  },
})