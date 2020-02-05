// https://developers.weixin.qq.com/miniprogram/dev/reference/api/Page.html
const app = getApp()
Page({
  data: {
    context: "This is college page data.",
    collegeArray: [],
    pageNum: 1,
    pageNums: 1,
    loadingHidden: false
  },
  onLoad: function (options) {
    // Do some initialize when page load.
    // wx.hideShareMenu()
    this.setData({
      pictureHost: app.globalData.pictureHost
    })

    this.search = this.selectComponent("#search")
  },
  onReady: function () {
    // Do something when page ready.
    this.getMore(1)
    // this.getMore(2)
  },
  onShow: function () {
    // Do something when page show.
  },
  goToCollegePage: function (e) {
    const id = e.currentTarget.id
    console.log('id', id)
    wx.navigateTo({
      url: "../college/detail/detail?id=" + id
    })
  },
  onHide: function () {
    // Do something when page hide.
  },
  onUnload: function () {
    // Do something when page close.
  },
  initData: function() {
    this.setData({
      collegeArray: [],
      pageNum: 1,
      pageNums: 1
    })
  },
  onPullDownRefresh: function () {
    // Do something when pull down.
    wx.showNavigationBarLoading()
    this.initData()
    this.getMore(1)
    // this.getMore(2)
  },
  getMore: function (pageNum) {
    const num = this.data.pageNum
    const nums = this.data.pageNums
    pageNum = pageNum ? pageNum : 2;
    console.log('getMore pagenum', pageNum + "; num = " + num + "; nums = " + nums)
    const that = this;
    const apiUrl = app.globalData.cheerFishHost + 'api/schools'
    const Data = { "pageNum": pageNum }
    if (nums >= num && pageNum <= nums) {
      wx.request({
        url: apiUrl,
        data: Data,
        header: {
          'appId': app.globalData.appId,
          'userIdentity': app.globalData.userInfo ?  app.globalData.userInfo.identity : ''
        },
        success: res => {
          setTimeout(function () {
            that.setData({
              loadingHidden: true
            });
          }, 500);
          if (res.statusCode === 200) {
            if (res.data.code === 10000) {
              // console.log("res is " + JSON.stringify(res))
              let tmpArr = that.data.collegeArray
              tmpArr.push.apply(tmpArr, res.data.data.list)
              const pagenum = that.data.pageNum + 1
              const rows = res.data.data.pageInfo.totalPageNums
              console.log("pagenum is " + pagenum)
              that.setData({
                collegeArray: tmpArr,
                pageNum: pagenum,
                pageNums: rows
              })
              this.getMore(pagenum)
            } else {
              console.log('获取学院列表失败statusCode=' + res.statusCode)
            }
          } else {
            console.log('获取学院列表失败statusCode=' + res.statusCode)
          }
          wx.hideNavigationBarLoading()
          wx.stopPullDownRefresh()
        },
        fail: res => {
          console.log('获取学院列表失败statusCode=' + res.statusCode)
          wx.hideNavigationBarLoading()
          wx.stopPullDownRefresh()
        }
      })
    } else {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
    }
  },
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
  onShareAppMessage: function () {
    // return custom share data when user share.
  },
  onPageScroll: function () {
    // Do something when page scroll
  },
  onResize: function () {
    // Do something when page resize
  },
  gohome: function (e) {
    wx.switchTab({
      url: '/pages/profile/profile'
    })
  },
})
