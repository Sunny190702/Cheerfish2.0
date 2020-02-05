// pages/profile/blance/blance.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const data = {
      title: 'Cheerfish鱼币规则',
      content1: '\n \t鱼\t币的多少一定程度上是衡量校友活跃程度、热心程度的标志。\n &ensp;本&ensp;规则生效日期：2019年9月10日，平台具有最终解释权，相关规则将依据具体情况进行更新。\n\n一、如何获得鱼币\n1.新用户注册即赠送200鱼币；\n2.鱼币奖励规则：\n（1）	发布奖励。\n     A．	活动发布奖励。每成功发布活动1次，奖励50鱼币 / 次；\n    B．	招聘发布奖励。每成功发布招聘1次，奖励25鱼币 / 次；\n    C．	求职发布奖励。每成功发布求职1次，奖励25鱼币 / 次；\n    D．	合作发布奖励。每成功发布合作1次，奖励25鱼币 / 次；\n（2）	邀请奖励。\n    邀请他人注册，邀请人每成功邀请注册成功1人，奖励50鱼币。鱼币以被邀请人注册时正确填写邀请人手机号为准。\n\n 二、鱼币消耗方式\n1.置顶消耗。\n对于发布的活动、招聘、求职、合作等信息，可选择置顶，每置顶一次，消耗100鱼币。置顶的信息，平台将给予重点推广。\n2.奖品兑换消耗。\n平台将不定期举办鱼币兑换奖品活动，具体鱼币兑换规则将以届时详细兑换要求为准。\n3.其他消耗。\n依据届时具体其他消耗规则为准。\n\n',

    }
    const header = {
      'appId': app.globalData.appId,
      'userIdentity': app.globalData.userInfo ? app.globalData.userInfo.identity : ''
    }

    wx.request({
      url: app.globalData.cheerFishHost + 'api/guides',
      data: {
        type: 1
      },
      header: header,
      method: 'GET',
      success: res => {
        console.log("blance is " + JSON.stringify(res))
        if (res.statusCode === 200) {
          if (res.data.code === 10000) {
            this.setData({
              item: res.data.data ? res.data.data.content : data,
            })
          }
        }
      }
    })
    wx.hideShareMenu()
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