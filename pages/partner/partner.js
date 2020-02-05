var util = require('../../utils/util.js');
const app = getApp()
Page({
  data: {
    list: [],
    pageNum: 1,
    pageNums: 1,
    loadingHidden: false,
    //显示添加小程序引导页 
    showAddInfo: true,
  },
  onLoad: function(options) {
    // Do some initialize when page load.
    // wx.hideShareMenu()
    // this.notice = this.selectComponent("#notice");
    //显示注册引导页
    if (wx.getStorageSync("showAddInfo") === '1') {
      this.data.showAddInfo = false
    }

    this.setData({
      pictureHost: app.globalData.pictureHost,
      userLevelInfo: app.globalData.userInfo ? app.globalData.userInfo.accountLevel : '',
      showAddInfo: this.data.showAddInfo
    })
    this.fetchPartnerList(1)
    // this._fetchNotices()
  },
  _fetchNotices() {
    this.notice._fetchNotices()
  },
  onReady: function() {
    // Do something when page ready.
    this.search = this.selectComponent("#search");
    this.introduce = this.selectComponent("#introduce")
  },
  onShow: function() {
    // Do something when page show.
    const userLevel = app.globalData.userInfo ? app.globalData.userInfo.accountLevel : 0
    if (this.data.target === 1 && userLevel > 0) {
      if (this.data.type === 'new') {
        wx.navigateTo({
          url: "/pages/partner/new/new"
        })
        this.data.target = 0
        this.data.type = ''
      }
    }
  },
  searhpage: function (e) {
    this.search.searchPage()
  },
  initData: function() {
    this.setData({
      list: [],
      pageNum: 1,
      pageNums: 1,
    })
  },
  onPullDownRefresh: function () {
    // Do something when pull down.
    wx.showNavigationBarLoading()
    this.initData()
    this.fetchPartnerList(1)
  },
  goToNewPage: function () {
    // if (!app.globalData.userInfo) {
    //   this.toast.show("请先在我的中加入名校精英后可发布活动")
    //   return
    // } 
    const userLevel = app.globalData.userInfo ? app.globalData.userInfo.accountLevel : 0
    console.log("userLevel is " + userLevel)
    if (userLevel > 0) {
      wx.navigateTo({
        url: "/pages/partner/new/new"
      })
    } else {
      wx.navigateTo({
        url: "/pages/user/index?action=completeUserInfo&type=new"
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
      url: "./detail/detail?id="+id
    })
    setTimeout(() => {
      that.setData({ list: obj })
    }, 1000);
  },
  advisory: function (e) {
    // if (!app.globalData.userInfo) {
    //   this.toast.show("请先在我的中加入名校精英后可查看联系信息")
    //   return
    // } 
    const userLevel = app.globalData.userInfo ? app.globalData.userInfo.accountLevel : 0
    console.log("userLevel is " + userLevel)
    if (userLevel > 0) {
      this.orderPartner(e)
    } else {
      wx.navigateTo({
        url: "/pages/user/index?action=completeUserInfo"
      })
    }
  },
  orderPartner: function (e) {
    console.log('e', e);
    const id = e.target.id
    const cooperation = this.data.list.find(function (x) {
      return x.id == id
    })
    console.log('cooperation', cooperation)
    wx.showModal({
      title: '联系方式',
      showCancel: false,
      confirmText: '返回',
      content: '电话:' + cooperation.phone + ',' + '\r\n' + '邮箱:' + cooperation.email,
      success (res) {
        if (res.confirm) {
          // wx.request({
          //   url: 'https://test.hanstate.com/CheerFishTest/api/cooperation-favorites',
          //   data: {"cooperationId": id},
          //   header: {
          //     'appId': 'QY22ba49b22efc6209',
          //     'userIdentity': this.data.identity
          //   },
          //   method: 'POST',
          //   success: res => {
          //     console.log('cooperation favorities success ', res)
          //   },
          //   fail: res => {
          //     console.log('cooperation favorities false ', res)
          //   }
          // })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  fetchPartnerList: function (pageNum) {
    pageNum = pageNum
    console.log('fetchPartnerList pagenum', pageNum)
    const that = this;
    const apiUrl = app.globalData.cheerFishHost + 'api/cooperations'
    const Data = {
      'pageNum': pageNum
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
        if (res.statusCode === 200) {
          if (res.data.code === 10000) {
            let tmpArr = that.data.list;
            tmpArr.push.apply(tmpArr, res.data.data.list)
            const pagenum = that.data.pageNum+1
            const rows =  res.data.data.pageInfo.totalPageNums
            let newArr = this.resetTime(tmpArr)
            that.setData({
              list: newArr,// tmpArr,
              pageNum: pagenum,
              pageNums: rows
            })
          } else {
            console.log("获取合作列表失败 " + res.data.msg)
          }
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
  onReachBottom: function () {
    const num = this.data.pageNum
    const nums = this.data.pageNums
    if (nums >= num) {
      this.fetchPartnerList(num)
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
    var time = util.formatTime(new Date());
    var now = new Date();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    const message = '最新校友企业合作信息分享（截至' + month + '月' + day + '日）'
    return {
      title: message,
      path: '/pages/partner/partner',
      // imageUrl: '/images/default/appshare.png',
    }
  },
  resetTime: function (dataArr) {
    for (var j = 0; j < dataArr.length; j++) {
      dataArr[j].updatedAt = dataArr[j].updatedAt.replace('T', ' ')
    }
    return dataArr;
  },
  // 是否显示引导页
  showAddInfo: function () {
    this.introduce.clickMask()
  },
})