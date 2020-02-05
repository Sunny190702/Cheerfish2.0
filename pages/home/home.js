var util = require('../../utils/util.js');
const app = getApp()
Page({
  data: {
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '我的主页', //导航栏 中间的标题
    },
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 2 + 20,
    ads: [{
      picture: '/images/default/dpartner2.png',
      id: '1'
    }],
    list_ads: [],
    list_enter_course: [],
    list_new_course: [],
    list_all: [],
    pageNum: 1,
    pageNums: 1,
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    collegeArray: [],
    collegeList: [],
    loadingHidden: false,
    //显示添加小程序引导页 
    showAddInfo: true,
  },
  onLoad: function(options) {
    this.checkForAppUpdate()
    // wx.hideShareMenu()
    //this.notice = this.selectComponent("#notice");
    //显示注册引导页
    if (wx.getStorageSync("showAddInfo") === '1') {
      this.data.showAddInfo = false
    }
    this.adsUrl = app.globalData.cheerFishHost + 'api/ads'
    this.setData({
      navH: app.globalData.navHeight,
      pictureHost: app.globalData.pictureHost,
      showAddInfo: this.data.showAddInfo
    })

    this._fetchAds()
    this._fetchCollegeList()
    // this._fetchEnteringCourseList()
    // this._fetchNewCourseList()
    this._fetchAllCourseList(1)
    // this.getMoreCoures(1)
    // this._fetchNotices()
  },
  checkForAppUpdate: function() {
    console.log("当前版本号v1.0.04");
    // 用户版本更新  
    if (wx.canIUse("getUpdateManager")) {
      let updateManager = wx.getUpdateManager();
      updateManager.onCheckForUpdate((res) => {
        // 请求完新版本信息的回调      
        console.log("***res.hasUpdate = " + res.hasUpdate);
      })
      updateManager.onUpdateReady(() => {
        wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          success: (res) => {
            if (res.confirm) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启        
              updateManager.applyUpdate();
            } else if (res.cancel) {
              return false;
            }
          }
        })
      })
      updateManager.onUpdateFailed(() => {
        // 新的版本下载失败      
        wx.hideLoading();
        wx.showModal({
          title: '升级失败',
          content: '新版本下载失败，请检查网络！',
          showCancel: false
        });
      });
    }
  },
  onReady: function() {
    // Do something when page ready.
    this.search = this.selectComponent("#search");
    this.introduce = this.selectComponent("#introduce")
  },
  onShow: function() {
    // Do something when page show.
  },
  goToCollegeListPage: function(e) {
    // console.log('e', e)
    wx.navigateTo({
      url: "../college/college"
    })
  },
  goToCollegePage: function(e) {
    const id = e.currentTarget.id
    console.log('id', id)
    wx.navigateTo({
      url: "../college/detail/detail?id=" + id
    })
  },
  goToCoursePage: function(e) {
    const that = this
    const id = e.currentTarget.id
    let item = this.data.list_all
    function pFn(p) { return p.id == id }
    const index = item.findIndex(pFn)
    console.log('index is ', index)
    if (index >= 0) {
      item[index].hot = item[index].hot + 1
    }
    wx.navigateTo({
      url: "./course/course?id=" + id
    })
    setTimeout(() => {
      that.setData({ list_all: item })
    }, 1000);
  },
  joinTap(e) {
    // if (!app.globalData.userInfo) {
    //   this.toast.show("请先在我的中加入名校精英后可预约咨询课程")
    //   return
    // } 
    const userLevel = app.globalData.userInfo ? app.globalData.userInfo.accountLevel : 0
    console.log("userLevel is " + userLevel)
    if (userLevel > 0) {
      this.orderCourse(e)
    } else {
      wx.navigateTo({
        url: "/pages/user/index?action=completeUserInfo"
      })
    }
  },
  orderCourse: function(e) {
    const that = this
    const id = e.currentTarget.id
    let item = this.data.list_all

    function pFn(p) {
      return p.id == id
    }
    const index = item.findIndex(pFn)
    const course = item[index]
    console.log('index course is ', course)
    if (course.isRegister == '1') {
      wx.showToast({
        title: '您已预约咨询该课程',
        icon: 'none',
        duration: 2000
      })
    } else {
      wx.showModal({
        title: '课程咨询',
        content: '咨询:' + course.name,
        success(res) {
          if (res.confirm) {
            wx.request({
              url: app.globalData.cheerFishHost + 'api/course-registers',
              data: {
                "courseId": id,
                "isRegister": 1,
              },
              header: {
                'appId': app.globalData.appId,
                'userIdentity': app.globalData.userInfo ? app.globalData.userInfo.identity : ''
              },
              method: 'POST',
              success: res => {
                console.log('id is ', id)
                if (res.statusCode === 200) {
                  if (res.data.code === 10000) {
                    let obj = item
                    obj[index].isRegister = '1'
                    console.log('obj ', item)
                    that.setData({
                      list_all: item
                    })
                    wx.showToast({
                      title: '预约咨询成功',
                      icon: 'success',
                      duration: 2000
                    })
                  } else {
                    wx.showToast({
                      title: '预约咨询失败',
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
                console.log('courseItem favorities success ', res)
              },
              fail: res => {
                console.log('courseItem favorities false ', res)
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },
  searchPage: function(e) {
    console.log('e', e.currentTarget.dataset.page)
    wx.navigateTo({
      url: "/pages/search/index"
    })
  },
  _fetchAds() {
    const header =
      wx.request({
        url: this.adsUrl,
        data: {},
        header: {
          'appId': app.globalData.appId,
          'userIdentity': app.globalData.userInfo ? app.globalData.userInfo.identity : ''
        },
        success: res => {
          if (res.statusCode === 200) {
            // console.log("获取广告列表", JSON.stringify(res.data))
            if (res.data.code === 10000) {
              // res.data.data.list.forEach((element, index, array) => {
              //   element.picture = app.globalData.pictureHost + res.data.data.list.picture
              // })
              this.setData({
                list_ads: res.data.data.list
              })
            } else {
              console.log('获取广告列表失败errorCode=' + res.data.code)
            }
          } else {
            console.log('获取广告列表失败statusCode=' + res.statusCode)
          }
        },
        fail: res => {
          console.log("WX request fail")
        }
      })
  },

  _fetchCollegeList() {
    const header =
      wx.request({
        url: app.globalData.cheerFishHost + 'api/schools',
        data: {},
        header: {
          'appId': app.globalData.appId,
          'userIdentity': app.globalData.userInfo ? app.globalData.userInfo.identity : 0
        },
        success: res => {
          if (res.statusCode === 200) {
            // console.log(JSON.stringify(res.data))
            if (res.data.code === 10000) {
              const list = res.data.data.list
              console.log('获取学院列表', list.slice(0, 8))
              this.setData({
                collegeList: list.slice(0, 8)
              })
            } else {
              console.log('获取学院列表失败errorCode=' + res.data.code)
            }
          } else {
            console.log('获取学院列表失败statusCode=' + res.statusCode)
          }
        },
        fail: res => {
          console.log("WX request fail")
        }
      })
  },

  _fetchEnteringCourseList() {
    const header =
      wx.request({
        url: app.globalData.cheerFishHost + 'api/courses',
        data: {
          // courseType: '0',
          category:'0'
        },
        header: {
          'appId': app.globalData.appId,
          'userIdentity': app.globalData.userInfo ? app.globalData.userInfo.identity : ''
        },
        success: res => {
          if (res.statusCode === 200) {
            console.log("正在报名课程 ： " + JSON.stringify(res.data))
            if (res.data.code === 10000) {
              this.setData({
                list_enter_course: res.data.data.list
              })
            } else {
              console.log('获取正在报名列表失败errorCode=' + res.data.code)
            }
          } else {
            console.log('获取正在报名列表失败statusCode=' + res.statusCode)
          }
        },
        fail: res => {
          console.log("WX request fail")
        }
      })
  },

  _fetchNewCourseList() {
    const header =
      wx.request({
        url: app.globalData.cheerFishHost + 'api/courses',
        data: {
          // courseType: '1',
          category:'1'
        },
        header: {
          'appId': app.globalData.appId,
          'userIdentity': app.globalData.userInfo ? app.globalData.userInfo.identity : ''
        },
        success: res => {
          if (res.statusCode === 200) {
            console.log("新上课程 ： " + JSON.stringify(res.data))
            if (res.data.code === 10000) {
              const list = res.data.data.list
              this.setData({
                list_new_course: list.slice(0, 1)
              })
            } else {
              console.log('获取新上列表失败errorCode=' + res.data.code)
            }
          } else {
            console.log('获取新上列表失败statusCode=' + res.statusCode)
          }
        },
        fail: res => {
          console.log("WX request fail")
        }
      })
  },

  _fetchAllCourseList(pageNum) {
    pageNum = pageNum ? pageNum : 2;
    const that = this;
    const Data = {
      "pageNum": pageNum,
      "courseType": '2'
    }
    const header =
      wx.request({
        url: app.globalData.cheerFishHost + 'api/courses',
        data: {
          "pageNum": pageNum,
          // courseType: '2',
          category:'2'
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
          if (res.statusCode === 200) {
            if (res.data.code === 10000) {
              // console.log('全部课程 ：', res.data.data.list)
              let tmpArr = that.data.list_all;
              tmpArr.push.apply(tmpArr, res.data.data.list)
              const pagenum = that.data.pageNum + 1
              const rows = res.data.data.pageInfo.totalPageNums
              // console.log('tmpArr ：', tmpArr)
              that.setData({
                list_all: tmpArr,
                pageNum: pagenum,
                pageNums: rows
              })
            } else {
              console.log('获取全部列表失败errorCode=' + res.data.code)
            }
          } else {
            console.log('获取全部列表失败statusCode=' + res.statusCode)
          }
          wx.hideNavigationBarLoading() //完成停止加载
          wx.stopPullDownRefresh() //停止下拉刷新
        },
        fail: res => {
          console.log("WX request fail")
          wx.hideNavigationBarLoading() //完成停止加载
          wx.stopPullDownRefresh() //停止下拉刷新
        }
      })
  },

  _fetchNotices() {
    this.notice._fetchNotices()
  },

  searhpage: function(e) {
    this.search.searchPage()
  },
  onHide: function() {
    // Do something when page hide.
  },
  onUnload: function() {
    // Do something when page close.
  },
  onPullDownRefresh: function() {
    // this.clearCache()
    wx.showNavigationBarLoading()
    this.setData({
      list_all:[],
      list_ads: [],
      collegeList: [],
      pageNum: 1,
    })
    this._fetchAds()
    this._fetchCollegeList()
    this._fetchAllCourseList(1)
  },
  bottom() {
    const num = this.data.pageNum
    const nums = this.data.pageNums
    if (nums >= num) {
      this._fetchAllCourseList(num)
    } else {
      wx.showToast({
        title: '没有更多了!!!',
        icon: 'none',
        duration: 2500
      })
    }
  },
  onReachBottom: function() {
    this.bottom()
  },
  onShareAppMessage: function() {
    // return custom share data when user share.
    var time = util.formatTime(new Date());
    var now = new Date();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    const message = '高管最新课程分享（截至' + month + '月' + day + '日）'
    return {
      title: message,
      path: '/pages/home/home',
      imageUrl: '/images/default/appshare.png',
    }
  },
  onPageScroll: function() {
    // Do something when page scroll
  },
  onResize: function() {
    // Do something when page resize
  },
  searchPage: function(e) {
    console.log('e', e)
  },
  // 是否显示引导页
  showAddInfo: function () {
    this.introduce.clickMask()
  },
})