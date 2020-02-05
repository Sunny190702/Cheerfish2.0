// pages/profile/assistant/assistant.js
const app = getApp();
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
    this.setData({
      pictureHost: app.globalData.pictureHost,
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
    return {
      title: app.globalData.userInfo ? app.globalData.userInfo.userBaseInfo.name + '邀请您加入名校精英社，结交高端校友人脉' : '邀请您加入名校精英社，结交高端校友人脉',
      path: '/pages/index/index',
      imageUrl: '/images/default/appshare.png',
    }
  },
  previewImage: function (e) {
    var current = e.target.dataset.src;   //这里获取到的是一张本地的图片

    wx.previewImage({
      // urls: [],
      current: current,//需要预览的图片链接列表
      urls: [current] //当前显示图片的链接
    })
  },

  gohome: function (e) {
    wx.switchTab({
      url: '/pages/profile/profile'
    })
  },
})