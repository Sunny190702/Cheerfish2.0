const app = getApp()
Page({
  data: {
    unAuthorized: true,
    needAuthentication: true,
    vipFlag: false,
  },
  onLoad: function() {
    console.log("profile")
    wx.hideShareMenu()
  },
  fetchInfo: function() {
    const header = {
      'appId': app.globalData.appId,
      'userIdentity': app.globalData.userInfo ? app.globalData.userInfo.identity : ''
    }
    wx.request({
      url: app.globalData.cheerFishHost + 'api/users/1',
      data: {},
      header: header,
      method: 'GET',
      success: res => {
        console.log("blance is "+ JSON.stringify(res))
        // console.log("blance is " + res.data.data.userPlatformInfo.balance)
        if (res.statusCode === 200) {
          if (res.data.code === 10000) {
            this.setData({
              blance: res.data.data ? res.data.data.userPlatformInfo.balance : 0,
            })
          }
        }
      }
    })
  },
  onShow: function() {
    console.log("profile")

    //更新鱼币
    this.fetchInfo()
    
    if (app.globalData.userInfo) {
      this.data.unAuthorized = false
      if (app.globalData.userInfo.accountLevel == app.globalData.account_level1) {
        this.data.needAuthentication = true
        this.data.vipFlag = false
      } else if (app.globalData.userInfo.accountLevel == app.globalData.account_level2){
        this.data.needAuthentication = false
        this.data.vipFlag = false
      } else if (app.globalData.userInfo.accountLevel == app.globalData.account_level3) {
        this.data.needAuthentication = false
        this.data.vipFlag = true
      }
    } 

    this.setData({
      header: app.globalData.userInfo ? app.globalData.userInfo.userBaseInfo.header : '',
      name: app.globalData.userInfo ? app.globalData.userInfo.userBaseInfo.name : '',
      blance: app.globalData.userInfo ? app.globalData.userInfo.userPlatformInfo.balance : 0,
      unAuthorized: this.data.unAuthorized,
      needAuthentication: this.data.needAuthentication,
      vipFlag: this.data.vipFlag
    })
  },
  onAuthorizeHandler: function (e) {
    wx.navigateTo({
      url: "/pages/index/index?action=author"
    })
  },
  onAuthenticationHandler: function(e) {
    wx.navigateTo({
      url: "/pages/user/index?action=authentication"
    })
  },
  onUpgradeVipHandler: function(e) {
    wx.navigateTo({
      url: "/pages/profile/static/upgradevip"
    })
  },
  onEditHandler: function(e) {
    if (this.needAuthentication) {
      console.log("未注册用户不可编辑个人信息")
      return
    }
    wx.navigateTo({
      url: "/pages/user/index?action=edit"
    })
  },
  onInvitationCodeHandler: function(e) {
    const type = e.currentTarget.dataset.type
    wx.navigateTo({
      url: "/pages/profile/static/index?type=" + type
    })
  },

  goToCollectPage: function(e) {
    const userLevel = app.globalData.userInfo ? app.globalData.userInfo.accountLevel : 0
    if (userLevel > 0) {
      const type = e.currentTarget.dataset.type
      wx.navigateTo({
        url: "/pages/profile/collect/index?type=" + type
      })
    } else {
      wx.showToast({
        title: this.data.unAuthorized ? '请先授权' : '请先注册',
        icon: 'loading',
        duration: 1000
      })
    }
  },
  goToNewPage: function(e) {
    const userLevel = app.globalData.userInfo ? app.globalData.userInfo.accountLevel : 0
    if (userLevel > 0) {
      const type = e.currentTarget.dataset.type
      wx.navigateTo({
        url: "/pages/profile/new/index?type=" + type
      })
    } else {
      wx.showToast({
        title: this.data.unAuthorized ? '请先授权' : '请先注册',
        icon: 'loading',
        duration: 1000,
      })
    }
  },
  goToJoinPage: function(e) {
    const userLevel = app.globalData.userInfo ? app.globalData.userInfo.accountLevel : 0
    if (userLevel > 0) {
      const type = e.currentTarget.dataset.type
      wx.navigateTo({
        url: "/pages/profile/join/index?type=" + type
      })
    } else {
      wx.showToast({
        title: this.data.unAuthorized ? '请先授权' : '请先注册',
        icon: 'loading',
        duration:1000,
      })
    }
  },
  goToReportPage: function(e) {
    const userLevel = app.globalData.userInfo ? app.globalData.userInfo.accountLevel : 0
    if (userLevel > 0) {
      const type = e.currentTarget.dataset.type
      wx.navigateTo({
        url: "/pages/profile/report/index?type=" + type
      })
    } else {
      wx.showLoading({
        title: this.data.unAuthorized ? '请先授权' : '请先注册',
        icon: 'loading',
        duration: 1000,
      })
    }
  },
  toMenuForAssistant: function() {
    wx.navigateTo({
      url: "/pages/profile/assistant/assistant"
    })
  },
  goToOwnerPage(e) {
    const type = e.currentTarget.dataset.type
    wx.navigateTo({
      url: "/pages/profile/static/owner"
    })
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  switch: function(e) {
    const length = this.data.objectArray.length
    for (let i = 0; i < length; ++i) {
      const x = Math.floor(Math.random() * length)
      const y = Math.floor(Math.random() * length)
      const temp = this.data.objectArray[x]
      this.data.objectArray[x] = this.data.objectArray[y]
      this.data.objectArray[y] = temp
    }
    this.setData({
      objectArray: this.data.objectArray
    })
  },
  addToFront: function(e) {
    const length = this.data.objectArray.length
    this.data.objectArray = [{
      id: length,
      unique: 'unique_' + length
    }].concat(this.data.objectArray)
    this.setData({
      objectArray: this.data.objectArray
    })
  },
  addNumberToFront: function(e) {
    this.data.numberArray = [this.data.numberArray.length + 1].concat(this.data.numberArray)
    this.setData({
      numberArray: this.data.numberArray
    })
  },
  onShareAppMessage: function() {
    return {
      title: app.globalData.userInfo ? app.globalData.userInfo.userBaseInfo.name + '邀请您加入名校精英社，结交高端校友人脉' : '邀请您加入名校精英社，结交高端校友人脉',
      path: '/pages/index/index',
      imageUrl: '/images/default/appshare.png',
    }
  },
  toMenuForPrivacy: function() {
    wx.navigateTo({
      url: "/pages/profile/static/privacy"
    })
  },
  toMenuForService: function() {
    wx.navigateTo({
      url: "/pages/profile/static/service"
    })
  },
  toMenuForBlance: function () {
    wx.navigateTo({
      url: "/pages/profile/blance/blance"
    })
  },
  blanceRules: function (e) {
    wx.navigateTo({
      url: '/pages/profile/blance/blance',
    })
  },  
  toMenuForModelInfo: function(){
    wx.navigateTo({
      url: '/pages/profile/modelInfo/info',
    })
  },
  toMenuMore: function (){
    wx.navigateTo({
      url: '/pages/profile/message/message',
    })
  },
  goToMyJoinGroupPage: function (e) {
    const userLevel = app.globalData.userInfo ? app.globalData.userInfo.accountLevel : 0
    if (userLevel > 0) {
      wx.navigateTo({
        url: "/pages/homepage/joinGroups"
      })
    } else {
      wx.showToast({
        title: this.data.unAuthorized ? '请先授权' : '请先注册',
        icon: 'loading',
        duration: 1000
      })
    }
  },
})