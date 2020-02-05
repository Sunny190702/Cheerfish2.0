// https://developers.weixin.qq.com/miniprogram/dev/reference/api/Page.html
var util = require('../../utils/util.js');
const app = getApp()
Page({
  data: {
    list: [],
    pageNum: 1,
    pageNums: 1,
    collegeArray: [],
    refreshhidden:true,
    loadingHidden: false,
    //显示添加小程序引导页 
    showAddInfo: true,
  },
  onLoad: function(options) {
    // this.notice = this.selectComponent("#notice");
    // wx.hideShareMenu()

    //显示注册引导页
    if (wx.getStorageSync("showAddInfo") === '1') {
      this.data.showAddInfo = false
    }
    this.setData({
      pictureHost: app.globalData.pictureHost,
      userLevelInfo: app.globalData.userInfo ? app.globalData.userInfo.accountLevel : '',
      showAddInfo: this.data.showAddInfo
    })
    this.fetchActivityList(1)
    // this._fetchNotices()
  },
  _fetchNotices() {
    this.notice._fetchNotices()
  },

  onReady: function() {
    // Do something when page ready.
    this.search = this.selectComponent("#search")
    this.introduce = this.selectComponent("#introduce")
  },
  searhpage: function (e) {
    this.search.searchPage()
  },
  advisory(e){
    // if (!app.globalData.userInfo) {
    //   this.toast.show("请先在我的中加入名校精英后可报名参加活动")
    //   return;
    // }
    const userLevel = app.globalData.userInfo ? app.globalData.userInfo.accountLevel : 0
    console.log("userLevel is " + userLevel)
    if (userLevel > 0) {
      this.advisory1(e)
    } else {
      wx.navigateTo({
        url: "/pages/user/index?action=completeUserInfo"
      })
    }
  },
  advisory1: function (e) {
    const that = this
    console.log('e', e);
    const id = e.target.id
    const act = that.data.list.find(function (x) {
      return x.id == id
    })
    console.log('act', act)
    function pFn(p){return p.id == id }
    const list = that.data.list
    const a = list.findIndex(pFn)
    if (act.isRegister == '1') {
      wx.showToast({
        title: '您已报名过该课程',
        icon: 'none',
        duration: 2000
      })
    } else {
      wx.showModal({
        title: '活动报名',
        content: '报名:' + act.title + '\r\n' +
                 '地点:' + act.address + '\r\n' +
                 '时间:' + act.start.substring(0, 10),
        success(res) {
          if (res.confirm) {
            wx.request({
              url: app.globalData.cheerFishHost + 'api/activity-registers',
              data: { 
                "activityId": id,
                "isRegister": 1,
              },
              header: {
                'appId': app.globalData.appId,
                'userIdentity': app.globalData.userInfo ? app.globalData.userInfo.identity : ''
              },
              method: 'POST',
              success: res => {
                if (res.statusCode === 200) {
                  if (res.data.code === 10000) {
                    let obj = that.data.list
                    obj[a].isRegister = '1'
                    // obj[a].start = obj[a].start.substring(0, 10)
                    wx.showToast({
                      title: '报名成功',
                      icon: 'success',
                      duration: 2000
                    })
                    that.setData({list: obj})
                  } else {
                    wx.showToast({
                      title: '报名失败',
                      icon: 'success',
                      duration: 2000
                    })
                  }
                } else {
                  wx.showToast({
                    title: '报名失败',
                    icon: 'success',
                    duration: 2000
                  })
                }
                console.log('act registers success ', res)
              },
              fail: res => {
                console.log('act registers false ', res)
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },
  goToDetailPage: function (e) {
    const that = this
    const id = e.currentTarget.id
    console.log('id', id)
    let item = that.data.list
    function pFn(p) { return p.id == id }
    const a = item.findIndex(pFn)
    console.log('q', a)
    let obj = item
    obj[a].hot = obj[a].hot+1
    wx.navigateTo({
      url: "/pages/activity/detail/detail?id="+id
    })
    setTimeout(() => {
      that.setData({ list: obj })
    }, 1000);
  },
  goToNewPage: function (e) {
    const userLevel = app.globalData.userInfo ? app.globalData.userInfo.accountLevel : 0
    console.log("userLevel is " + userLevel)
    if (userLevel > 0) {
      wx.navigateTo({
        url: "/pages/activity/new/new"
      })
    } else {
      wx.navigateTo({
        url: "/pages/user/index?action=completeUserInfo&type=new"
      })
    }
  },
  onShow: function() {
    // Do something when page show.
    const userLevel = app.globalData.userInfo ? app.globalData.userInfo.accountLevel : 0
    console.log("this.data.target = " + this.data.target)
    console.log("this.data.type  = " + this.data.type)
    if (this.data.target === 1 && userLevel > 0) {
      if (this.data.type === 'new') {
        wx.navigateTo({
          url: "/pages/activity/new/new"
        })
        this.data.target = 0
        this.data.type = ''
      }
    }
  },
  onHide: function() {
    // Do something when page hide.
  },
  onUnload: function() {
    // Do something when page close.
    clearTimeout()
  },
  onPullDownRefresh: function() {
    // Do something when pull down.
    wx.showNavigationBarLoading()
    this.setData({
      list:[],
      pageNum: 1,
    })
    this.fetchActivityList(1)
  },
  fetchActivityList: function (pageNum) {
    pageNum = pageNum ? pageNum : 2;
    console.log('fetchActivityList pagenum', pageNum)
    const that = this;
    const apiUrl = app.globalData.cheerFishHost + 'api/activities'
    const Data = {"pageNum": pageNum}
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
        if (res.statusCode === 200) {
          if (res.data.code === 10000) {
            let tmpArr = that.data.list;
            tmpArr.push.apply(tmpArr, res.data.data.list)
            console.log("tmpArr " + JSON.stringify(tmpArr))
            const pagenum = that.data.pageNum+1
            const rows =  res.data.data.pageInfo.totalPageNums
            let newArr = that.resetStart(tmpArr)
            console.log("newArr " + JSON.stringify(newArr))
            that.setData({
              list: newArr,
              pageNum: pagenum,
              pageNums: rows,
            })
          } else {
            console.log("活动列表加载失败 ", res.data.msg )
          }
        }
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
      },
      fail: res => {
        console.log("活动列表加载失败 ", res.errMsg)
        // wx.showToast({
        //   title: res.errMsg,
        //   icon: 'none',
        //   duration: 2000
        // })
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
      }
    })
  },
  bottom() {
    const num = this.data.pageNum
    const nums = this.data.pageNums
    if (nums >= num) {
      this.fetchActivityList(num)
    } else {
      wx.showToast({
        title: '没有更多了!!!',
        icon: 'none',
        duration: 2500
      })
    }
  },
  resetStart: function (dataArr) {
    for (var j = 0; j < dataArr.length; j++) {
      dataArr[j].start = dataArr[j].start.substring(0, 10)
    }
    return dataArr;
  },
  onReachBottom: function() {
    // Do something when page reach bottom.
    this.bottom()
  },
  onShareAppMessage: function () {
    // return custom share data when user share.
    var time = util.formatTime(new Date());
    var now = new Date();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    const message = '最新校友活动信息分享（截至' + month + '月' + day + '日）'
    return {
      title: message,
      path: '/pages/activity/activity',
      // imageUrl: '/images/default/appshare.png',
    }
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
  searchPage: function (e) {
    console.log('e', e.currentTarget.dataset.page)
    wx.navigateTo({
      url: "/pages/search/index"
    })
  },
  // 是否显示引导页
  showAddInfo: function () {
    this.introduce.clickMask()
  },
})
