// pages/college/detail/detail.js
const app = getApp()
Page({
  data: {
    item: {},
    pageNum: 1,
    pageNums: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getMore(1)
    wx.hideShareMenu()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // this.modal = this.selectComponent("#modal");
  },
  gohome: function (e) {
    wx.switchTab({
      url: '/pages/homepage/index'
    })
  },
  getMore(pageNum){
    pageNum = pageNum
    console.log('getMore pagenum', pageNum)
    const that = this;
    const apiUrl = app.globalData.cheerFishHost + 'api/cooperations'
    const Data = {
      'pageNum': pageNum
    }
    wx.request({
      url: apiUrl,
      data: Data,
      header: {
        'appId': app.globalData.appId,
        'userIdentity': app.globalData.userInfo ? app.globalData.userInfo.identity : ''
      },
      success: res => {
        if (res.statusCode === 200) {
          if (res.data.code === 10000) {
            let tmpArr = res.data.data.list
            that.setData({
              list: tmpArr
            })
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
          }
        } else {
          wx.showToast({
            title: '网络错误',
            icon: 'none',
            duration: 2000,
          })
        }
      },
      fail: res => {
        wx.showToast({
          title: res.errMsg,
          icon: 'none',
          duration: 2000
        })
      }
    })
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
    const num = this.data.pageNum
    const nums = this.data.pageNums
    if (nums >= num) {
      this.getMore(num)
    } else {
      wx.showToast({
        title: '没有更多了!!!',
        icon: 'none',
        duration: 2500
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})