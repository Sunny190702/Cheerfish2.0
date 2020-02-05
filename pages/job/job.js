// https://developers.weixin.qq.com/miniprogram/dev/reference/api/Page.html
var util = require('../../utils/util.js');
const app = getApp()
Page({
  data: {
    job1: [],
    job2: [],
    context: "This is course page data.",
    currentTab: 0,
    loading: true,
    pageNum1: 1,
    pageNums1: 1,
    pageNum2: 1,
    pageNums2: 1,
    loadingHidden: false,
    //显示添加小程序引导页 
    showAddInfo: true,
  },
  onLoad: function(options) {
    // Do some initialize when page load.
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
    // this._fetchNotices()
  },
  _fetchNotices() {
    this.notice._fetchNotices()
  },
  onReady: function() {
    // Do something when page ready.
    this.search = this.selectComponent("#search")
    this.introduce = this.selectComponent("#introduce")
    this.fetchJobList(1)
  },
  onShow: function() {
    // Do something when page show.
    const userLevel = app.globalData.userInfo ? app.globalData.userInfo.accountLevel : 0
    if (this.data.target === 1 && userLevel > 0) {
      if (this.data.type === 'new') {
        const type = this.data.currentTab
        const userLevel = app.globalData.userInfo ? app.globalData.userInfo.accountLevel : 0
        console.log("userLevel is " + userLevel)
        wx.navigateTo({
          url: "/pages/job/new/new?type=" + type
        })
        this.data.target = 0
        this.data.type = ''
      }
    }
  },
  searhpage: function (e) {
    this.search.searchPage()
  },
  goToNewPage: function (e) {
    // if (!app.globalData.userInfo) {
    //   this.toast.show("请先在我的中加入名校精英后可发布招聘/求职信息")
    //   return
    // } 
    const type = e.currentTarget.dataset.type
    const userLevel = app.globalData.userInfo ? app.globalData.userInfo.accountLevel : 0
    console.log("userLevel is " + userLevel)
    if (userLevel > 0) {
      wx.navigateTo({
        url: "/pages/job/new/new?type=" + type
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
    const type = e.currentTarget.dataset.type
    let item = []
    if (type == 'recruits') {
      item = that.data.job1
    } else if (type == 'seekers') {
      item = that.data.job2
    }
    function pFn(p) { return p.id == id }
    const a = item.findIndex(pFn)
    console.log('q', a)
    let obj = item
    obj[a].hot = obj[a].hot+1
    wx.navigateTo({
      url: "./detail/detail?id="+id+'&type=' + type
    })
    setTimeout(() => {
      if (type == 'recruits') {
        that.setData({ job1: obj })
      } else if (type == 'seekers') {
        that.setData({ job2: obj })
      }
    }, 1000);
  },
  clickTab: function (e) {
    console.log('e', e);
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
      })
      this.bottom(1)
    }
  },
  advisory: function (e) {
    // if (!app.globalData.userInfo) {
    //   this.toast.show("请先在我的中加入名校精英后可查看联系信息")
    //   return
    // } 
    // let phoneNumber = e.currentTarget.dataset.phone
    // let email = e.currentTarget.dataset.email
    console.log(e)

    const userLevel = app.globalData.userInfo ? app.globalData.userInfo.accountLevel : 0
    console.log("userLevel is " + userLevel)
    if (userLevel > 0) {
      const id = e.target.id
      const type = e.target.dataset.type
      const recruit = type == 'job1' ? this.data.job1.find(function (x) {
        return x.id == id
      }) : this.data.job2.find(function (x) {
        return x.id == id
      })
      console.log('recruit', recruit)
      wx.showModal({
        title: '联系方式',
        showCancel: false,
        confirmText: '返回',
        content: '电话:' + recruit.phone + ',' + '\r\n' + '邮箱:' + recruit.email,
        success(res) {
          if (res.confirm) {
            // wx.makePhoneCall({
            //   phoneNumber: phoneNumber,
            // })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else {
      wx.navigateTo({
        url: "/pages/user/index?action=completeUserInfo"
      })
    }
  },
  onHide: function() {
    // Do something when page hide.
  },
  onUnload: function() {
    // Do something when page close.
  },
  initData: function() {
    if (this.data.currentTab == '0') {
      this.setData({
        job1:[],
        pageNum1: 1,
      })
    } else {
      this.setData({
        job2: [],
        pageNum2: 1,
      })
    }
  },
  onPullDownRefresh: function() {
    // Do something when pull down.
    wx.showNavigationBarLoading()
    this.initData()
    this.fetchJobList(1)
  },
  fetchJobList: function (pageNum) {
    pageNum = pageNum ? pageNum : 2;
    console.log('fetchJobList pagenum', pageNum)
    const that = this;
    const apiUrl = that.data.currentTab == '0' ? app.globalData.cheerFishHost + 'api/recruits' : app.globalData.cheerFishHost + 'api/seekers'
    const Data = { "pageNum": pageNum }
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
            if (that.data.currentTab == '0') {
              let tmpArr = that.data.job1
              tmpArr.push.apply(tmpArr, res.data.data.list)
              const pagenum = that.data.pageNum1+1
              const rows1 =  res.data.data.pageInfo.totalPageNums
              // console.log("tmpArr " + JSON.stringify(tmpArr))
              let newArr1 = this.resetTime(tmpArr)
              that.setData({
                // job1: tmpArr,
                job1: newArr1,
                pageNum1: pagenum,
                pageNums1: rows1
              })
            } else {
              let tmpArr = that.data.job2;
              tmpArr.push.apply(tmpArr, res.data.data.list)
              const pagenum = that.data.pageNum2+1
              const rows2 =  res.data.data.pageInfo.totalPageNums
              let newArr2 = this.resetTime(tmpArr)
              that.setData({
                // job2: tmpArr,
                job2: newArr2,
                pageNum2: pagenum,
                pageNums2: rows2,
                loading: false
              })
            }
          } else {
            // wx.showToast({
            //   title: res.data.msg,
            //   icon: 'none',
            //   duration: 2000
            // })
            console.log('找人列表获取失败 '+ res.data.msg,)
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
      fail: res =>  {
        // wx.showToast({
        //   title: res.errMsg,
        //   icon: 'none',
        //   duration: 2000
        // })
        console.log('找人列表获取失败 ' + res.errMsg)
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
      }
    })
  },
  bottom (e) {
    const num = this.data.currentTab == '0' ? this.data.pageNum1 : this.data.pageNum2
    const nums = this.data.currentTab == '0' ? this.data.pageNums1 : this.data.pageNums2
    if (nums >= num) {
      this.fetchJobList(num)
    } else {
      if (e == 1) {
      } else {
        wx.showToast({
          title: '没有更多了!!!',
          icon: 'none',
          duration: 2500
        })
      }
    }
  },
  onReachBottom: function () {
    this.bottom()
  },
  onShareAppMessage: function () {
    // return custom share data when user share.
    var time = util.formatTime(new Date());
    var now = new Date();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    var tab = this.data.currentTab == '0' ? '招聘' : '求职'
    return {
      title: '最新校友企业' + tab + '信息分享（截至' + month + '月' + day + '日）',
      path: '/pages/job/job',
      // imageUrl: '/images/default/appshare.png',
    }
  },
  onPageScroll: function() {
    // Do something when page scroll
  },
  onResize: function() {
    // Do something when page resize
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
