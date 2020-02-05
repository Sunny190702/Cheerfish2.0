// pages/profile/modelInfo/info.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const data = {
      title: '订阅消息',
      content1: '按钮，勾选“总是”（如下图），第一时间掌握新鲜通知、活动资讯。\n\n',

    }

    this.setData({
      item: data.content1,
    })

    wx.hideShareMenu()
  },


  setModelInfo: function () {
    console.log("requestSubscribeMessage")
    wx.requestSubscribeMessage({
      tmplIds: [app.globalData.tmplId1, app.globalData.tmplId2],
      success(res) {
        console.log(res)
      },
      fail(res) {
        console.log(res)
        wx.showModal({
          title: '提示',
          content: '需要您授权打开订阅消息',
          showCancel: false,
          success: modalSuccess => {
            wx.openSetting({
              success(settingdata) {
                console.log("settingdata ", settingdata)
              },
              fail(failData) {
                console.log("failData ", failData)
              },
              complete(finishData) {
                console.log("finishData ", finishData)
              }
            })
          }
        })
      }, complete: function (res) {
        console.log("requestSubscribeMessage")
      },
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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