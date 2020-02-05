const app = getApp();
Page({
  data: {},

  onLoad: function (options) {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: app.globalData.userInfo.userBaseInfo.name + '邀请您加入名校精英社，结交高端校友人脉',
      path: '/pages/index/index',
      imageUrl: '/images/default/appshare.png',
    }
  },
  gohome: function (e) {
    wx.switchTab({
      url: '/pages/homepage/index'
    })
  },
  copyText: function (e) {
    console.log(e)
    wx.setClipboardData({
      data: 'service@hanstate.com',
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功'
            })
          }
        })
      }
    })
  },
})