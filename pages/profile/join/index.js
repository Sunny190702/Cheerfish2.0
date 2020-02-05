// https://developers.weixin.qq.com/miniprogram/dev/reference/api/Page.html
const app = getApp()
Page({
  data: {
    context: "This is course page data.",
    currentTab: 1,
    activities: [],
    courses: [],
    pageNum1: 1,
    pageNums1: 1,
    pageNum2: 1,
    pageNums2: 1,
  },
  onLoad: function(options) {
    // Do some initialize when page load.
    wx.hideShareMenu()
    this.setData({
      pictureHost: app.globalData.pictureHost,
      userLevelInfo: app.globalData.userInfo.accountLevel,
    })
    console.log('options', options)
    this.fetchData()
  },
  fetchData: function(){
    const that = this
    wx.request({
      url: app.globalData.cheerFishHost + 'api/activity-registers',
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
            console.log('activities register加载失败 ' + res.data.msg)
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
        console.log('aactivities register加载失败 ' + res.errMsg)
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
      }
    })
    wx.request({
      url: app.globalData.cheerFishHost + 'api/course-registers',
      data: { 'owner': '0'},
      header: {
        'appId': app.globalData.appId,
        'userIdentity': app.globalData.userInfo ? app.globalData.userInfo.identity : ''
      },
      success: res => {
        if (res.statusCode === 200) {
          if (res.data.code === 10000) {
            const courselist = res.data.data.list
            console.log('courses list ', courselist)
            const pagenum = that.data.pageNum2 + 1
            const rows = res.data.data.pageInfo.totalPageNums
            this.setData({
              courses: courselist,
              pageNum: pagenum,
              pageNums: rows,
            })

            that.data.pageNum2 = pagenum
            that.data.pageNums2 = rows
          } else {
            console.log('course-registers 加载失败' + res.data.msg)
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
        console.log('course-registers 加载失败' + res.errMsg)
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
      }
    })
  },
  onReady: function() {
    // Do something when page ready.
    this.activity = this.selectComponent("#activity")
    this.courses = this.selectComponent("#courses")
  },
  onShow: function() {
    // Do something when page show.
  },
  goToCoursePage: function (e) {
    const id = e.currentTarget.id
    console.log('id', id)
    wx.navigateTo({
      url: "/pages/home/course/course?id="+id
    })
  },
  goToActivityPage: function (e) {
    const id = e.currentTarget.id
    console.log('id', id)
    wx.navigateTo({
      url: "/pages/activity/detail/detail?id="+id
    })
  },
  goToPartnerPage: function () {

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
    }
  },
  advisory: function (e) {
    console.log('e', e);
    const id = e.target.id
    const type = e.target.dataset.type
    const recruit = type == 'activity' ? this.data.activities.find(function (x) {
      return x.id == id
    }) : this.data.courses.find(function (x) {
      return x.id == id
    })
    function pFn(p){return p.id == id }
    const a = recruit.findIndex(pFn)
    console.log('recruit', recruit)
    const text = type == 'activity' ? '报名'+recruit.title : '咨询'+recruit.name
    const posturl = type == 'activity' ? app.globalData.cheerFishHost + 'api/activity-favorites' : app.globalData.cheerFishHost + 'api/course-favorites'
    const bodydata = type =='activity' ? {"recruitId": id} : {"seekerId": id}
    wx.showModal({
      // title: recruit.name,
      content: text,
      success (res) {
        if (res.confirm) {
          wx.request({
            url: posturl,
            data: bodydata,
            header: {
              'appId': app.globalData.appId,
              'userIdentity': app.globalData.userInfo ? app.globalData.userInfo.identity : ''
            },
            method: 'POST',
            success: res => {
              console.log('recruit favorities success ', res)
            },
            fail: res => {
              console.log('recruit favorities false ', res)
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  onHide: function() {
    // Do something when page hide
  },
  onUnload: function() {
    // Do something when page close.
  },
  onPullDownRefresh: function() {
    // Do something when pull down.
    wx.showNavigationBarLoading()
    this.setData({
      activities: [],
      courses: [],
      pageNum1: 1,
      pageNums1: 1,
      pageNum2: 1,
      pageNums2: 1,
    })
    this.fetchData(1)
  },
  onReachBottom: function() {
    // Do something when page reach bottom.
    var num = this.data.pageNum1
    var nums = this.data.pageNums1
    if (this.data.currentTab == 0) {
      num = this.data.pageNum1
      nums = this.data.pageNums1
    } else if (this.data.currentTab == 1) {
      num = this.data.pageNum2
      nums = this.data.pageNums2
    } 
    if (nums >= num) {
      this.fetchData(num)
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
  onPageScroll: function() {
    // Do something when page scroll
  },
  onResize: function() {
    // Do something when page resize
  },
  resetStart: function (dataArr) {
    for (var j = 0; j < dataArr.length; j++) {
      dataArr[j].start = dataArr[j].start.substring(0, 10)
      // dataArr[j].start = dataArr[j].start.replace('T', ' ')
    }
    return dataArr;
  },
})
