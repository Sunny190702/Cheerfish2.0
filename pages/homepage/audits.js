// pages/homepage/audits.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    pageNum: 1,
    pageNums: 1,
    loadingHidden: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      groupId: this.options.id,
      pictureHost: app.globalData.pictureHost,
      userLevelInfo: app.globalData.userInfo ? app.globalData.userInfo.accountLevel : '',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.fetchList(1)
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
    wx.showNavigationBarLoading()
    this.initData()
    this.fetchList(1)
  },
  initData: function () {
    this.setData({
      list: [],
    })
    this.data.pageNum = 1
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
  fetchList: function (pageNum) {
    pageNum = pageNum ? pageNum : 2;
    const that = this;
    const apiUrl = app.globalData.cheerFishHost + 'api/group-audits'
    console.log("pageNum = " + pageNum)
    console.log("this.data.groupId = " + this.data.groupId)
    const Data = { 
      "pageNum": pageNum,
      "groupId": this.data.groupId
    }
    wx.request({
      url: apiUrl,
      data: Data,
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
        console.log("===========")
        console.log(res)
        if (res.statusCode === 200) {
          if (res.data.code === 10000) {
            let tmpArr = that.data.list;
            tmpArr.push.apply(tmpArr, res.data.data.list)
            console.log(tmpArr)
            const pagenum = that.data.pageNum + 1
            const rows = res.data.data.pageInfo.totalPageNums
            let newArr = that.resetTime(tmpArr)
            that.setData({
              list: newArr,
              pageNum: pagenum,
              pageNums: rows,
            })
          } else {
            console.log("审核列表加载失败 ", res.data.msg)
          }
        }
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
      },
      fail: res => {
        console.log("审核列表加载失败 ", res.errMsg)
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
      }
    })
  },
  resetTime: function (dataArr) {
    for (var j = 0; j < dataArr.length; j++) {
      dataArr[j].updatedAt = dataArr[j].updatedAt.replace('T', ' ')
    }
    return dataArr;
  },
  goToDetailPage: function (e) {
    const id = e.currentTarget.id
    const type = e.currentTarget.dataset.type
    if (type == 1) {
      wx.navigateTo({
        url: "/pages/activity/detail/detail?id=" + id
      })
    } else if (type == 2) {
      wx.navigateTo({
        url: "/pages/job/detail/detail?id=" + id + '&type=recruits'
      })
    } else if (type == 3) {
      wx.navigateTo({
        url: "/pages/job/detail/detail?id=" + id + '&type=seekers'
      })
    } else if (type == 4) {
      wx.navigateTo({
        url: "/pages/partner/detail/detail?id=" + id
      })
    } else {
      console.log("goToDetailPage failed , type is " + type)
    }
  },

  gohome: function () {
    wx.switchTab({
      url: '/pages/homepage/index'
    })
  },
  bindAudits: function (e) {
    const apiUrl = app.globalData.cheerFishHost + 'api/group-audits'
    const Data = {
      "infoId": e.currentTarget.dataset.id,
      "category": e.currentTarget.dataset.type,
      "auditResult": e.currentTarget.dataset.result,
      "groupId": this.data.groupId
    }
    wx.request({
      url: apiUrl,
      data: Data,
      header: {
        'appId': app.globalData.appId,
        'userIdentity': app.globalData.userInfo ? app.globalData.userInfo.identity : ''
      },
      method: 'POST',
      success: res => {
        console.log(res.data);
        if (res.statusCode === 200) {
          if (res.data.code === 10000) {
            wx.showToast({
              title: res.data.data,
              icon: 'none',
              duration: 2000,
            })
          } 
        }

      },
      fail: res => {
        console.log("审核失败 ", res.errMsg)
      }
    })
  },
})