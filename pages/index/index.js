const base64 = require('../../utils/base64.js')
const app = getApp()
Page({
  data: {},

  onLoad: function(options) {
    console.log("pages/index options is "+JSON.stringify(options))
    // this.targetPath = options.targetPath
    this.action = options.action
    this.typeFrom = options.typeFrom
    this.bindUserUrl = app.globalData.cheerFishHost + 'api/users'
    this.toast = this.selectComponent('.toast')
    if (app.globalData.userInfo) {
      // wx.switchTab({
      //   url: '/pages/home/home'
      // })
      wx.switchTab({
        url: '/pages/homepage/index',
      })      
    } else {
      this.setData({
        showLogin: true
      })
    }
  },

  getUserInfo: function(e) {
    const that = this
    if (!e.detail.userInfo) {
      return
    }
    wx.showLoading({
      title: '登录中'
    })
    wx.login({
      success: res => {
        if (res.code) {
          let userInfo = e.detail.userInfo;
          let bindUserModel = {
            code: res.code,
            avatarUrl: userInfo.avatarUrl,
            nickName: userInfo.nickName,
            gender: userInfo.gender,
          }
          wx.request({
            url: that.bindUserUrl,
            data: bindUserModel,
            header: {
              'Content-Type': 'application/json',
              'appId': app.globalData.appId
            },
            method: "POST",
            success: res => {
              if (res.statusCode === 200) {
                console.log(JSON.stringify(res.data))
                if (res.data.code === 10000) {
                  res.data.data.userBaseInfo.header = app.globalData.pictureHost + res.data.data.userBaseInfo.header;
                  app.globalData.userInfo = res.data.data
                  wx.setStorageSync('userInfo', app.globalData.userInfo)

                  const accountLevel = app.globalData.userInfo.accountLevel
                  console.log("accountLevel = " + accountLevel)
                  if (accountLevel > 0) {
                    // 详情界面操作功能
                    // 1、没授权的先授权
                    // 2、授权后进入注册界面
                    // 3、返回详情界面
                    // 4、注册过的用户执行详情界面的操作
                    if (that.action && that.action.indexOf('author') !== -1) {
                      var pages = getCurrentPages();
                      var prevPage = pages[pages.length - 2];  //上一个页面
                      //直接调用上一个页面对象的setData()方法，把数据存到上一个页面中去
                      if (prevPage != null) {
                        prevPage.setData({
                          target: 1,
                          type: that.typeFrom
                        });
                        wx.navigateBack()
                      } else {
                        // wx.navigateTo({
                        //   url: '/pages/home/home'
                        // })
                        wx.switchTab({
                          url: '/pages/homepage/index',
                        })
                      }
                      return
                    }
                  } else {
                    wx.redirectTo({
                      url: "/pages/user/index?action=authentication&type=" + this.typeFrom,
                    })
                    return
                  }


                  /* 授权后直接进入home界面，不再显示个人信息完善界面*/
                  // wx.switchTab({
                  //   url: '/pages/home/home'
                  // })
                  wx.switchTab({
                    url: '/pages/homepage/index',
                  })
                } else {
                  that.toast.show('登录失败,请重试')
                }
              } else {
                that.toast.show('服务器忙')
              }

            },
            fail: (error) => {
              that.toast.show('登录失败,请重试')
            },
            complete: () => {
              wx.hideLoading();
            }
          })
        } else {
          that.toast.show('登录失败,请重试')
          wx.hideLoading();
        }

      },
      fail: res => {
        that.toast.show('登录失败,请重试')
        wx.hideLoading();
      },
    })
  }
})