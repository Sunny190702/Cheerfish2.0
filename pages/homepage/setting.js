// pages/homepage/setting.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    join_check:1,
    show_check:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      groupId: options.id,
      master: options.master === 'false' ? false : true,
      member: options.member === 'false' ? false : true,
      pictureHost: app.globalData.pictureHost,
      userLevelInfo: app.globalData.userInfo ? app.globalData.userInfo.accountLevel : '',
      // member: this.options.member
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

  },
  bindAudits: function () {
    wx.navigateTo({
      url: './audits?id=' + this.data.groupId,
    })
  },
  bindExit: function (){
    const that = this
    wx.request({
      url: app.globalData.cheerFishHost + 'api/group-join/' + this.data.groupId,
      data: {},
      header: {
        'appId': app.globalData.appId,
        'userIdentity': app.globalData.userInfo ? app.globalData.userInfo.identity : ''
      },
      method: 'DELETE',
      success: res => {
        console.log(res)
        if (res.statusCode === 200) {
          wx.showToast({
            title: res.data.msg,
            icon: 'success',
            duration: 2000
          })
          if (res.data.code === 10000) {
            wx.switchTab({
              url: '/pages/homepage/groups',
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
        console.log('item exit group false ', res)
        wx.showToast({
          title: res.errMsg,
          icon: 'none',
          duration: 2000,
        })
      }
    })
  },
  bindCheckForJoin: function () {
    this.data.join_check = this.data.join_check == 1? 0 : 1
  },
  bindShowSetting: function () {
    this.data.show_check = this.data.show_check == 1 ? 0 : 1
  },
  bindUpdateMaster: function () {

  },
  //获取加入条件
  fetchJoinCustomList: function (){

  },
  bindJoinSetting: function () {
    var model = JSON.stringify(this.data.customlist);
    const rulesLength = this.data.customlist ? this.data.customlist.length : 0
    if (rulesLength > 0) {
      //已设置加入条件
      wx.navigateTo({
        url: '/pages/editor/custom-menu?model=' + model,
      })
    } else {
      //未设置加入条件
      wx.navigateTo({
        url: '/pages/editor/custom-menu',
      })
    }
  },
  bindApplyMembers: function () {
    wx.navigateTo({
      url: './applyMemberList?id=' + this.data.groupId,
    })
  },
  goToMemberList: function () {
    // 管理员和成员可以查看成员列表
    wx.navigateTo({
      url: './members?id=' + this.data.groupId + "&master=" + this.data.master,
    })
  }
})