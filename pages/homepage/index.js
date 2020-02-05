// pages/homepage/index.js
const app = getApp()
Page({
  data: {
    followList: [],
    hotList: [],
    groupList: [],
    currentTab: 0,
    loading: true,
    pageNum1: 1,
    pageNums1: 1,
    pageNum2: 1,
    pageNums2: 1,
    loadingHidden: false
  },
  onLoad: function (options) {
    // Do some initialize when page load.
    this.setData({
      pictureHost: app.globalData.pictureHost,
      userLevelInfo: app.globalData.userInfo ? app.globalData.userInfo.accountLevel : '',
    })
  },

  onReady: function () {
    // Do something when page ready.
    this.fetchList(1)
    this.fetchGroupList()
  },
  onShow: function () {
    // Do something when page show.
  },
  goToGroupList: function (e) {
    const userLevel = app.globalData.userInfo ? app.globalData.userInfo.accountLevel : 0
    console.log(userLevel)
    if (userLevel > 0) {
      wx.switchTab({
        url: "./groups",
      })
    } else {
      wx.navigateTo({
        url: "/pages/user/index?action=completeUserInfo&type=new"
      })
    }
  },
  goToDetailPage: function (e) {
    const id = e.currentTarget.id
    // console.log("gotoDetail e is "+ JSON.stringify(e))
    let item = []
    if (this.data.currentTab == 0) {
      item = this.data.followList
    } else {
      item = this.data.hotList
    }
    let obj = item
    obj[id].hot = obj[id].hot + 1

    const infoId = e.currentTarget.dataset.id
    const type = e.currentTarget.dataset.type
    if (type == 1) {
      wx.navigateTo({
        url: "/pages/activity/detail/detail?id=" + infoId
      })
    } else if (type == 2 ) {
      wx.navigateTo({
        url: "/pages/job/detail/detail?id=" + infoId + '&type=recruits'
      })
    } else if (type == 3) {
      wx.navigateTo({
        url: "/pages/job/detail/detail?id=" + infoId + '&type=seekers'
      })
    } else if (type == 4) {
      wx.navigateTo({
        url: "/pages/partner/detail/detail?id=" + infoId
      })
    } else if (type == 5) {
      wx.navigateTo({
        url: "/pages/home/course/course?id=" + infoId
      })
    } else {
      console.log("goToDetailPage failed , type is "+ type)
    }

    const that = this
    setTimeout(() => {
      if (that.data.currentTab == 0) {
        that.setData({ followList: obj })
      } else{
        that.setData({ hotList: obj })
      }
    }, 300);
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
  onHide: function () {
    // Do something when page hide.
  },
  onUnload: function () {
    // Do something when page close.
  },
  initData: function () {
    if (this.data.currentTab == '0') {
      this.setData({
        followList: [],
      })
      this.data.pageNum1 = 1
    } else {
      this.setData({
        hotList: [],
      })
      this.data.pageNum2 = 1
    }
  },
  onPullDownRefresh: function () {
    // Do something when pull down.
    wx.showNavigationBarLoading()
    this.initData()
    this.fetchList(1)
    this.fetchGroupList()
  },
  fetchGroupList: function(){
    wx.request({
      url: app.globalData.cheerFishHost + 'api/groups',
      data: { "pageNum": 1 },
      header: {
        'appId': app.globalData.appId,
        'userIdentity': app.globalData.userInfo ? app.globalData.userInfo.identity : ''
      },
      success: res => {
        if (res.statusCode === 200) {
          if (res.data.code === 10000) {
            const list = res.data.data
            this.setData({
              groupList: list.list.slice(0, 5),
            })
          } else {
            console.log('fetchGroupList获取失败 ' + res.data.msg)
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
        wx.showToast({
          title: res.errMsg,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  fetchList: function (pageNum) {
    pageNum = pageNum ? pageNum : 2;
    const that = this;
    const apiUrl = that.data.currentTab == '0' ? app.globalData.cheerFishHost + 'api/follow-flow-infos' : app.globalData.cheerFishHost + 'api/flow-infos'
    const Data = { "pageNum": pageNum }
    // console.log("当前URI  " + apiUrl)
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
        }, 1000);
        if (res.statusCode === 200) {
          if (res.data.code == 10000) {
            if (that.data.currentTab == '0') {
              let tmpArr = that.data.followList
              tmpArr.push.apply(tmpArr, res.data.data.list)
              console.log('fetchList ' + JSON.stringify(tmpArr))
              const pagenum = that.data.pageNum1 + 1
              const rows1 = res.data.data.pageInfo.totalPageNums
              let newArr = this.resetTime(tmpArr)
              that.setData({
                followList: newArr,
                pageNum1: pagenum,
                pageNums1: rows1
              })
              that.data.pageNum1 = pagenum
              that.data.pageNums1 = rows1
            } else {
              let tmpArr = that.data.hotList;
              tmpArr.push.apply(tmpArr, res.data.data.list)
              console.log('fetchList 热点 ' + JSON.stringify(tmpArr))
              const pagenum = that.data.pageNum2 + 1
              const rows2 = res.data.data.pageInfo.totalPageNums
              let newArr2 = this.resetTime(tmpArr)
              that.setData({
                hotList: newArr2,
                pageNum2: pagenum,
                pageNums2: rows2,
                loading: false
              })
            }
          } else {
            console.log('获取失败 ' + res.data.msg)
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
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
      }
    })
  },
  bottom(e) {
    const num = this.data.currentTab == '0' ? this.data.pageNum1 : this.data.pageNum2
    const nums = this.data.currentTab == '0' ? this.data.pageNums1 : this.data.pageNums2
    if (nums >= num) {
      this.fetchList(num)
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
    return {
      title: app.globalData.userInfo.userBaseInfo.name + '邀请您加入精英社，结交高端校友人脉',
      path: '/pages/homepage/index',
      imageUrl: '/images/default/appshare.png',
    }
  },
  onPageScroll: function () {
    // Do something when page scroll
  },
  onResize: function () {
    // Do something when page resize
  },
  resetTime: function (dataArr) {
    for (var j = 0; j < dataArr.length; j++) {
      dataArr[j].updatedAt = dataArr[j].updatedAt.replace('T', ' ')
    }
    return dataArr;
  },
  bindJoinGroup: function(e){
    const userLevel = app.globalData.userInfo ? app.globalData.userInfo.accountLevel : 0
    if (userLevel > 0) {
      this.joinGroup(e)
    } else {
      wx.navigateTo({
        url: "/pages/user/index?action=completeUserInfo&type=order"
      })
    }
  },
  joinGroup: function(e) {
    const that = this
    let id = e.currentTarget.id
    wx.request({
      url: app.globalData.cheerFishHost + 'api/group-follow',
      data: { "groupId": id },
      header: {
        'appId': app.globalData.appId,
        'userIdentity': app.globalData.userInfo ? app.globalData.userInfo.identity : ''
      },
      method: 'POST',
      success: res => {
        console.log('item join success ', res)
        if (res.statusCode === 200) {
          if (res.data.code === 10000) {
            wx.showToast({
              title: '关注成功',
              icon: 'success',
              duration: 2000
            })
          } else {
            wx.showToast({
              title: '关注失败',
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
      },
      fail: res => {
        console.log('item join group false ', res)
      }
    })
  },
  goToGroupHome: function(e){
    const id = e.currentTarget.dataset.groupid
    wx.navigateTo({
      url: "./home?id=" + id
    })
  },
  resetTime: function (dataArr) {
    for (var j = 0; j < dataArr.length; j++) {
      dataArr[j].updatedAt = dataArr[j].updatedAt.replace('T', ' ')
    }
    return dataArr;
  },
})
