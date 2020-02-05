// https://developers.weixin.qq.com/miniprogram/dev/reference/api/Page.html
const app = getApp()
Page({
  data: {
    context: "This is course page data.",
    reports: [],
    showModal: false
  },
  onLoad: function (options) {
    // Do some initialize when page load.
    console.log('options', options)
    wx.request({
      url: app.globalData.cheerFishHost  + 'api/report-release',
      data: { 'owner': '0' },
      header: {
        'appId': app.globalData.appId,
        'userIdentity': app.globalData.userInfo ? app.globalData.userInfo.identity : ''
      },
      success: res => {
        console.log('code ', res.data.code)
        if (res.statusCode === 200) {
          if (res.data.code === 10000) {
            const palist = res.data.data.list
            console.log('获取举报列表 ', palist)
            this.setData({
              reports: palist
            })
          } else {
            console.log('获取举报列表msg ' + res.data.msg)
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
        console.log('获取举报列表errMsg ' + res.errMsg)
      }
    })
  },
  onReady: function () {
    // Do something when page ready.
    this.modal = this.selectComponent(".modal")
  },
  goToReportsPage(e){
    const id = e.currentTarget.id
    console.log('id', id)
    // wx.navigateTo({
    //   url: "./detail/detail?id="+id
    // })
  },
  onShow: function () {
    // Do something when page show.
  },
  onHide: function () {
    // Do something when page hide.
  },
  onUnload: function () {
    // Do something when page close.
  },
  onPullDownRefresh: function () {
    // Do something when pull down.
  },
  onReachBottom: function () {
    // Do something when page reach bottom.
  },
  onShareAppMessage: function () {
    // return custom share data when user share.
  },
  onPageScroll: function () {
    // Do something when page scroll
  },
  onResize: function () {
    // Do something when page resize
  }
})
