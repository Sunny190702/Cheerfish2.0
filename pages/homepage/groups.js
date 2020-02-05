// pages/homepage/groups.js
const app = getApp()
Page({
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
      pictureHost: app.globalData.pictureHost,
      userLevelInfo: app.globalData.userInfo ? app.globalData.userInfo.accountLevel : '',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getGroupList(1)
  },
  getGroupList(pageNum) {
    const that = this
    wx.request({
      url: app.globalData.cheerFishHost + 'api/groups',
      data: { "pageNum": pageNum },
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
            let tmpArr = that.data.list
            tmpArr.push.apply(tmpArr, res.data.data.list)
            console.log('getGroupList ' + JSON.stringify(tmpArr))
            const pagenum = that.data.pageNum + 1
            const rows = res.data.data.pageInfo.totalPageNums
            that.setData({
              list: tmpArr,
              pageNum: pagenum,
              pageNums: rows,
            })
            that.data.pageNum = pagenum
            that.data.pageNums = rows
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
    wx.showNavigationBarLoading()
    this.setData({
      list: [],
      pageNum: 1,
    })
    this.getGroupList(1)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    const num = this.data.pageNum
    const nums = this.data.pageNums
    if (nums >= num) {
      this.getGroupList(num)
    } else {
      wx.showToast({
        title: '没有更多了!!!',
        icon: 'none',
        duration: 2500
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  bindFollowGroup: function (e) {
    let id = e.target.dataset.id
    const userLevel = app.globalData.userInfo ? app.globalData.userInfo.accountLevel : 0
    if (userLevel > 0) {
      this.joinGroup(id)
    } else {
      wx.navigateTo({
        url: "/pages/user/index?action=completeUserInfo&type=order"
      })
    }
  },
  joinGroup: function (id) {
    const that = this
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
  goToDetailPage: function(e){
    const id = e.currentTarget.id
    wx.navigateTo({
      url: "./home?id=" + id
    })
  },
  goToNewPage: function (e) {
    const userLevel = app.globalData.userInfo ? app.globalData.userInfo.accountLevel : 0
    console.log("userLevel is " + userLevel)
    if (userLevel > 0) {
      wx.navigateTo({
        url: "/pages/homepage/createGroup"
      })
    } else {
      wx.navigateTo({
        url: "/pages/user/index?action=completeUserInfo&type=new"
      })
    }
  },
})