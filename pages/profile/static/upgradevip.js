const app = getApp();
Page({
  data: {},
  _showTipDialog: (content) => {
    wx.showToast({
      title: content,
      icon: 'none'
    })
  },
  onLoad: function(options) {
    this.upgradeVipUrl = app.globalData.cheerFishHost + 'api/upgrade-vips'
  },
  onActivityVipHandler: function(e) {
    let formData = e.detail.value
    if (formData.code === '') {
      this._showTipDialog('请输入激活码')
      return
    }
    wx.showLoading({
      title: ''
    })

    wx.request({
      url: this.upgradeVipUrl,
      header: {
        appId: app.globalData.appId,
        userIdentity: app.globalData.userInfo.identity,
        'Content-Type': 'application/json'
      },
      method: "POST",
      data: formData,
      success: res => {
        if (res.statusCode === 200) {
          console.log(JSON.stringify(res.data))
          if (res.data.code === 10000) {
            res.data.data.userBaseInfo.header = app.globalData.pictureHost + res.data.data.userBaseInfo.header;
            app.globalData.userInfo = res.data.data
            wx.setStorageSync('userInfo', app.globalData.userInfo)
            this._showTipDialog('VIP激活成功')
            wx.switchTab({
              url: '/pages/profile/profile',
              success: function (e) {
                var page = getCurrentPages().pop();
                if (page == undefined || page == null) return;
                page.onShow();
              }
            })
          } else {
            this._showTipDialog('激活码无效')
          }
        } else {
          this._showTipDialog('服务器忙')
        }

      },
      fail: res => {
        console.log("WX request fail")
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  },
})