// pages/homepage/apply.js
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
    this.setData({
      groupId: this.options.id,
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
  handleSubmit(e) {
    const data = e.detail.value["reason"]
    if (data == "") {
      wx.showModal({
        title: '提示',
        content: '请输入申请理由',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
    } else {
      this.apply(data)
    }
  },
  apply(data) {
    const that = this
    wx.request({
      url: app.globalData.cheerFishHost + 'api/group-join',
      data: { 
        "groupId": that.data.groupId , 
        "reason":  data
      },
      header: {
        'appId': app.globalData.appId,
        'userIdentity': app.globalData.userInfo ? app.globalData.userInfo.identity : ''
      },
      method: 'POST',
      success: res => {
        // console.log("=======Apply=====")
        // console.log(res)
        if (res.statusCode === 200) {
          if (res.data.code === 10000) {
            wx.showModal({
              title: '提醒',
              content: '订阅消息界面选择“总是”，才能获取审核结果和最新资讯！',
              showCancel: false,
              confirmText: '订阅',
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                  that.setModelInfo()
                }
              }
            })
          } else {
            wx.showToast({
              title: '申请失败，请稍后再试',
              icon: 'none',
              duration: 2000,
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
  setModelInfo: function () {
    // 成功后订阅模板消息后可報名成功
    const that = this
    wx.requestSubscribeMessage({
      tmplIds: [app.globalData.tmplId1, app.globalData.tmplId2],
      success(res) {
        console.log(res)
        wx.showToast({
          title: '申请成功，等待审核',
          icon: 'success',
          duration: 2000
        })
        setTimeout(function () {
          wx.navigateTo({
            url: '/pages/homepage/home?id=' + that.data.groupId
          })
        }, 1000)
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
                wx.showToast({
                  title: '申请成功，等待审核',
                  icon: 'success',
                  duration: 2000
                })
                setTimeout(function () {
                  wx.switchTab({
                    url: '/pages/homepage/groups'
                  })
                }, 1000)
              },
              fail(failData) {
                console.log("failData", failData)
              },
              complete(finishData) {
                console.log("finishData", finishData)
              }
            })
          }
        })
      }, complete: function (res) {
        console.log("requestSubscribeMessage")
      },
    })
  }
})