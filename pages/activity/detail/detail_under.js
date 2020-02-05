// pages/college/detail/detail.js
const app = getApp()
Page({
  data: {
    list: {},
    start: '',
    end: '',
    loadingHidden: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      activityId: this.options.id,
      pictureHost: app.globalData.pictureHost,
    })
    this.fetchActivityInfo()
    this.fetchBannerImage()
    wx.hideShareMenu()
  },
  fetchActivityInfo: function () {
    const that = this
    const url = app.globalData.cheerFishHost + 'api/activities/' + this.data.activityId
    wx.request({
      url: url,
      data: {},
      header: {
        'appId': app.globalData.appId,
        'userIdentity': app.globalData.userInfo ? app.globalData.userInfo.identity : ''
      },
      success: res => {
        setTimeout(function () {
          that.setData({
            loadingHidden: true
          });
        }, 500);
        if (res.statusCode === 200) {
          if (res.data.code === 10000) {
            const reslist = res.data.data
            console.log('activity item ', reslist)
            const starttime = reslist.start.replace('T', ' ')
            const endtime = reslist.end.replace('T', ' ')
            const deadLinetime = reslist.deadLine.replace('T', ' ')
            this.setData({
              list: reslist,
              start: starttime.substring(0, 16),
              end: endtime.substring(0, 16),
              deadLine: deadLinetime.substring(0, 16),
              updatedAt: reslist.updatedAt.replace('T', ' '),
            })
          } else {
            console.log('code !==10000', res)
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
          }
        }

      },
      fail: res => {
        console.log('activity item flase')
        wx.showToast({
          title: res.errMsg,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  fetchBannerImage: function () {
    const header = {
      'appId': app.globalData.appId,
      'userIdentity': app.globalData.userInfo ? app.globalData.userInfo.identity : ''
    }

    wx.request({
      url: app.globalData.cheerFishHost + 'api/info-backgrounds',
      data: {
        type: 5
      },
      header: header,
      method: 'GET',
      success: res => {
        if (res.statusCode === 200) {
          if (res.data.code === 10000) {
            this.setData({
              banner: res.data.data.background,
            })
          }
        }
      }
    })
  },  
  onReady: function () {
    this.modal = this.selectComponent("#modal");
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})