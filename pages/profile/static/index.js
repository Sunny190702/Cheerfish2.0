const app = getApp();
Page({
  data: {},

  onLoad: function(options) {
    this.invitationCodeUrl = app.globalData.cheerFishHost + 'api/invitation-codes'
    this.toast = this.selectComponent('.toast')

  },
  onFetchInvitationCodeHandler: function() {
    wx.showLoading({
      title: '邀请码获取中'
    })
    wx.request({
      url: this.invitationCodeUrl,
      header: {
        appId: app.globalData.appId,
        userIdentity: app.globalData.userInfo.identity
      },
      success: res => {
        if (res.statusCode === 200) {
          console.log(JSON.stringify(res.data))
          if (res.data.code === 10000) {
            this.invitation = res.data.data
            this.setData({
              invitationCode: this.invitation,
              showShare: true
            })
          } else {
            this.toast.show('获取邀请码失败')
          }
        } else {
          this.toast.show('服务器忙')
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
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: '名校精英VIP邀请码：' + this.invitation + '(有效期5分钟)',
      path: '/pages/profile/profile',
      imageUrl: '/images/default/appshare.png',
    }
  }

})
