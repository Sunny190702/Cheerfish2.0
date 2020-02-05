// pages/homepage/members.js
const app = getApp()
Page({
  data: {
    list: [],
    pageNum: 1,
    pageNums: 1,
    loadingHidden: false,
    systemInfo: app.globalData.systemInfo,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      groupId: options.id,
      master: options.master==='false' ? false : true,
      pictureHost: app.globalData.pictureHost,
      userLevelInfo: app.globalData.userInfo ? app.globalData.userInfo.accountLevel : '',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getmemberList(1)
  },
  getmemberList(pageNum) {
    const that = this
    var url = app.globalData.cheerFishHost + 'api/group-members'
    wx.request({
      url: url,
      data: { 
        "pageNum": pageNum,
        "groupId": this.data.groupId 
      },
      header: {
        'appId': app.globalData.appId,
        'userIdentity': app.globalData.userInfo ? app.globalData.userInfo.identity : ''
      },
      success: res => {
        setTimeout(function () {
          that.setData({
            loadingHidden: true
          });
        }, 300);
        // console.log('members ' + JSON.stringify(res))
        if (res.statusCode === 200) {
          if (res.data.code === 10000) {
            console.log('members ' + JSON.stringify(res.data.data))
            var data = res.data.data
            that.setData({
              list: data.list,
            })
          } else {
            console.log('list获取失败 ' + res.data.msg)
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
    console.log("systemInfo is " + this.data.systemInfo)
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
      this.getmemberList(num)
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

  },
  moveFromGroup: function (e) {
    let id = e.currentTarget.dataset.id
    const that = this
    wx.request({
      url: app.globalData.cheerFishHost + 'api/group-members/' + this.data.groupId,
      data: {
        "memberId": id
      },
      header: {
        'appId': app.globalData.appId,
        'userIdentity': app.globalData.userInfo ? app.globalData.userInfo.identity : ''
      },
      method: 'DELETE',
      success: res => {
        console.log(JSON.stringify(res))
        if (res.statusCode === 200) {
          if (res.data.code === 10000) {
            const arr = that.updateArr(that.data.list, id)
            that.setData({
              list: arr
            })
            wx.showToast({
              title: res.data.msg,
              icon: 'success',
              duration: 2000
            })
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'success',
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
        console.log('item exit group false ', res)
        wx.showToast({
          title: res.errMsg,
          icon: 'none',
          duration: 2000,
        })
      }
    })
  },
  updateArr: function (dataArr, id) {
    var arr = [];
    for (var j = 0; j < dataArr.length; j++) {
      if (dataArr[j].id != id) {
        arr.push(dataArr[j]);
      }
    }
    return arr;
  },
})