// https://developers.weixin.qq.com/miniprogram/dev/reference/api/Page.html
const app = getApp()
Page({
  data: {
    context: "This is course page data.",
    currentTab: 0,
    list: [],
    activities: [],
    cooperation: [],
    seeker: [],
    recruit: [],
    pageNum1: 1,
    pageNums1: 1,
    pageNum2: 1,
    pageNums2: 1,
    pageNum3: 1,
    pageNums3: 1,
    pageNum4: 1,
    pageNums4: 1,   
  },
  onLoad: function(options) {
    // Do some initialize when page load.
    console.log('options', options)
    wx.hideShareMenu()
    this.setData({
      pictureHost: app.globalData.pictureHost,
      userLevelInfo: app.globalData.userInfo ? app.globalData.userInfo.accountLevel : 0,
    })
    this.fetchData()
  },
  fetchData: function() {
    const that = this
    wx.request({
      url: app.globalData.cheerFishHost + 'api/activity-release',
      data: { 'owner': '0' },
      header: {
        'appId': app.globalData.appId,
        'userIdentity': app.globalData.userInfo ? app.globalData.userInfo.identity : ''
      },
      success: res => {
        if (res.statusCode === 200) {
          if (res.data.code === 10000) {
            const aclist = res.data.data.list
            console.log('activities list ', aclist)
            //列表显示活动年月日，详情显示具体时间
            let newArr = this.resetStart(aclist)
            const pagenum = that.data.pageNum1 + 1
            const rows = res.data.data.pageInfo.totalPageNums
            this.setData({
              activities: newArr,
              pageNum: pagenum,
              pageNums: rows,
            })
            that.data.pageNum1 = pagenum
            that.data.pageNums1 = rows    
          } else {
            console.log('activities 加载失败', res.data.msg)
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
        console.log('activities 加载失败', res.errMsg)
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
      }
    })
    wx.request({
      url: app.globalData.cheerFishHost + 'api/recruit-release',
      data: { 'owner': '0' },
      header: {
        'appId': app.globalData.appId,
        'userIdentity': app.globalData.userInfo ? app.globalData.userInfo.identity : ''
      },
      success: res => {
        if (res.statusCode === 200) {
          if (res.data.code === 10000) {
            const palist = res.data.data.list
            console.log('recruit list ', palist)
            let newArr = this.resetCreated(palist)
            const pagenum = that.data.pageNum2 + 1
            const rows = res.data.data.pageInfo.totalPageNums
            this.setData({
              recruit: newArr,//palist,
              pageNum: pagenum,
              pageNums: rows,
            })
            that.data.pageNum2 = pagenum
            that.data.pageNums2 = rows    
          } else {
            console.log('recruit 加载失败' + res.data.msg)
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
        console.log('recruit 加载失败' + res.errMsg)
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
      }
    })
    wx.request({
      url: app.globalData.cheerFishHost + 'api/seeker-release',
      data: { 'owner': '0' },
      header: {
        'appId': app.globalData.appId,
        'userIdentity': app.globalData.userInfo ? app.globalData.userInfo.identity : ''
      },
      success: res => {
        if (res.statusCode === 200) {
          if (res.data.code === 10000) {
            const palist = res.data.data.list
            console.log('seeker list ', palist)
            let newArr = this.resetCreated(palist)
            const pagenum = that.data.pageNum3 + 1
            const rows = res.data.data.pageInfo.totalPageNums
            this.setData({
              seeker: newArr,//palist,
              pageNum: pagenum,
              pageNums: rows,
            })
            that.data.pageNum3 = pagenum
            that.data.pageNums3 = rows    
          } else {
            console.log('seeker 加载失败' + res.data.msg)
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
        console.log('seeker 加载失败' + res.errMsg)
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
      }
    })
    wx.request({
      url: app.globalData.cheerFishHost + 'api/cooperation-release',
      data: { 'owner': '0' },
      header: {
        'appId': app.globalData.appId,
        'userIdentity': app.globalData.userInfo ? app.globalData.userInfo.identity : ''
      },
      success: res => {
        if (res.statusCode === 200) {
          if (res.data.code === 10000) {
            const palist = res.data.data.list
            console.log('cooperation list ', palist)
            let newArr = this.resetCreated(palist)
            const pagenum = that.data.pageNum4 + 1
            const rows = res.data.data.pageInfo.totalPageNums
            this.setData({
              cooperation: newArr,//palist,
              pageNum: pagenum,
              pageNums: rows,
            })
            that.data.pageNum4 = pagenum
            that.data.pageNums4 = rows    
          } else {
            console.log('cooperation 加载失败' + res.data.msg)
          }
        } else {
          console.log('cooperation 加载失败' + res.data.msg)
        }
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
      },
      fail: res => {
        console.log('cooperation 加载失败' + res.errMsg)
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
      }
    })
  },
  onReady: function() {
    // Do something when page ready.
    this.recruits = this.selectComponent("#recruits")
    this.partner = this.selectComponent("#partner")
    this.activity = this.selectComponent("#activity")
  },
  onShow: function() {
    // Do something when page show.
  },
  goToActivityPage: function (e) {
    const id = e.currentTarget.id
    console.log('id', id)
    wx.navigateTo({
      url: "/pages/activity/detail/detail?id="+id
    })
  },
  goToPartnerPage: function (e) {
    const id = e.currentTarget.id
    console.log('id', id)
    wx.navigateTo({
      url: "/pages/partner/detail/detail?id="+id
    })
  },
  goToJobPage: function (e) {
    const id = e.currentTarget.id
    console.log('id', id)
    const type = e.currentTarget.dataset.type
    console.log('type', type)
    wx.navigateTo({
      url: "/pages/job/detail/detail?id="+id+'&type=' + type
    })
  },
  advisory: function (e) {
    console.log('e', e);
    const id = e.target.id
    const course = this.data.list1.find(function (x) {
      return x.id == id
    })
    console.log('course', course)
    wx.showModal({
      // title: course.name,
      content: '咨询'+course.name,
      success (res) {
        if (res.statusCode === 200) {
          if (res.confirm) {
            wx.request({
              url: app.globalData.cheerFishHost + 'api/course-favorites',
              data: {"courseId": id},
              header: {
                'appId': app.globalData.appId,
                'userIdentity': app.globalData.userInfo ? app.globalData.userInfo.identity : ''
              },
              method: 'POST',
              success: res => {
                console.log('course favorities success ', res)
              },
              fail: res => {
                console.log('course favorities false ', res)
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        } else {
          wx.showToast({
            title: '网络错误',
            icon: 'none',
            duration: 2000,
          })
        }
      }
    })
  },
  clickTab: function (e) {
    console.log('e', e.target.dataset.current);
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
      })
      that.onBottom(1)
    }
  },
  onHide: function() {
    // Do something when page hide.
  },
  onUnload: function() {
    // Do something when page close.
  },
  onPullDownRefresh: function() {
    // Do something when pull down.
    wx.showNavigationBarLoading()
    this.setData({
      activities: [],
      cooperation: [],
      seeker: [],
      recruit: [],
      pageNum1: 1,
      pageNums1: 1,
      pageNum2: 1,
      pageNums2: 1,
      pageNum3: 1,
      pageNums3: 1,
      pageNum4: 1,
      pageNums4: 1, 
    })
    this.fetchData(1)  
  },
  onReachBottom: function() {
    // Do something when page reach bottom.
    this.onBottom()
  },
  onBottom: function (c){
    var num = this.data.pageNum1
    var nums = this.data.pageNums1
    if (this.data.currentTab == 0) {
      num = this.data.pageNum1
      nums = this.data.pageNums1
    } else if (this.data.currentTab == 1) {
      num = this.data.pageNum2
      nums = this.data.pageNums2
    } else if (this.data.currentTab == 2) {
      if (this.data.isSeeker) {
        num = this.data.pageNum4
        nums = this.data.pageNums4
      } else {
        num = this.data.pageNum3
        nums = this.data.pageNums3
      }
    } else if (this.data.currentTab == 3) {
      num = this.data.pageNum5
      nums = this.data.pageNums5
    }
    if (nums >= num) {
      this.fetchData(num)
    } else {
      if (c == 1) {
      } else {
        wx.showToast({
          title: '没有更多了!!!',
          icon: 'none',
          duration: 2500
        })
      }
    }
  },
  onShareAppMessage: function () {
    // return custom share data when user share.
  },
  onPageScroll: function() {
    // Do something when page scroll
  },
  onResize: function() {
    // Do something when page resize
  },
  onTabItemTap(item) {
    console.log(item.index)
    console.log(item.pagePath)
    console.log(item.text)
  },
  // Event handler.
  viewTap: function() {
    this.setData({
      text: 'Set some data for updating view.'
    }, function() {
      // this is setData callback
    })
  },
  customData: {
    hi: 'MINA'
  },
  resetStart: function (dataArr) {
    for (var j = 0; j < dataArr.length; j++) {
      dataArr[j].start = dataArr[j].start.substring(0, 10)
      // dataArr[j].updatedAt = dataArr[j].updatedAt.replace('T', ' ')
    }
    return dataArr;
  },
  resetCreated: function (dataArr) {
    for (var j = 0; j < dataArr.length; j++) {
      // dataArr[j].start = dataArr[j].start.substring(0, 10)
      dataArr[j].updatedAt = dataArr[j].updatedAt.replace('T', ' ')
    }
    return dataArr;
  },  
  gohome: function (e) {
    wx.switchTab({
      url: '/pages/homepage/index'
    })
  },
})
