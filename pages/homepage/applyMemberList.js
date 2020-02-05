// pages/homepage/applyMemberList.js
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
  fetchList: function (pageNum){
    const that = this
    wx.request({
      url: app.globalData.cheerFishHost + 'api/group-apply-audits',
      data: { 
        "pageNum": pageNum, 
        "groupId": that.data.groupId
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
        }, 500);
        console.log("===============list")
        console.log(JSON.stringify(res))
        if (res.statusCode === 200) {
          if (res.data.code === 10000) {
            const list = res.data.data
            const pagenum = that.data.pageNum + 1
            const rows = res.data.data.pageInfo.totalPageNums

            that.setData({
              list: list.list,
              pageNum: pagenum,
              pageNums: rows,
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
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
      },
      fail: res => {
        wx.showToast({
          title: res.errMsg,
          icon: 'none',
          duration: 2000
        })
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
      }
    })
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
  bindApply: function (e) {
    const that = this
    const apiUrl = app.globalData.cheerFishHost + 'api/group-apply-audits'
    console.log("applyId = " +  e.currentTarget.dataset.id)
    console.log("auditResult = " + e.currentTarget.dataset.result)
    const id = e.currentTarget.dataset.id
    const Data = {
      // "groupId": this.data.groupId,
      "applyId": id, 
      "auditResult": e.currentTarget.dataset.result
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
            const arr = that.updateArr(that.data.list, id)
            that.setData({
              list: arr
            })
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