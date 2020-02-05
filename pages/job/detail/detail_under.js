// pages/college/detail/detail.js
const app = getApp()
Page({
  data: {
    list: {},
    isRecruits: true,
    loadingHidden: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options', this.options)
    this.setData({
      systemInfo: app.globalData.systemInfo,
      pictureHost: app.globalData.pictureHost,
    })

    this.fetchInfo()
    this.fetchBackgroundImage()
    this.fetchBannerImage()
    wx.hideShareMenu()
  },

  fetchInfo:function() {
    const that = this
    const recruitsUrl = app.globalData.cheerFishHost + 'api/recruits/' + this.options.id
    const seekersUrl = app.globalData.cheerFishHost + 'api/seekers/' + this.options.id

    if (this.options.type == 'recruits') {
      wx.request({
        url: recruitsUrl,
        data: {},
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
              const reslist = res.data.data
              console.log('job1 item ', reslist)
              this.setData({
                list: reslist,
                isRecruits: true,
                updatedAt: reslist.updatedAt.replace('T', ' ')
              })
            } else {
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 2000,
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
          console.log('job1 item flase')
        }
      })
    } else {
      wx.setNavigationBarTitle({
        title: '详情'
      })
      wx.request({
        url: seekersUrl,
        data: {},
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
            const reslist = res.data.data
            console.log('job2 item ', reslist)
            this.setData({
              list: reslist,
              isRecruits: false,
              updatedAt: reslist.updatedAt.replace('T', ' ')
            })
          } else {
            wx.showToast({
              title: '网络错误',
              icon: 'none',
              duration: 2000,
            })
          }
        },
        fail: res => {
          console.log('job2 item flase')
        }
      })
    }
  },
  fetchBackgroundImage: function () {
    const header = {
      'appId': app.globalData.appId,
      'userIdentity': app.globalData.userInfo ? app.globalData.userInfo.identity : ''
    }

    wx.request({
      url: app.globalData.cheerFishHost + 'api/info-backgrounds',
      data: {
        type: this.options.type == 'recruits' ? 2 : 3
      },
      header: header,
      method: 'GET',
      success: res => {
        if (res.statusCode === 200) {
          if (res.data.code === 10000) {
            this.setData({
              item: res.data.data.background,
            })
          }
        }
      }
    })
  },
  fetchBannerImage: function () {
    const header = {
      'appId': app.globalData.appId,
      'userIdentity': app.globalData.userInfo ? app.globalData.userInfo.identity : ''
    }

    wx.request({
      url: app.globalData.cheerFishHost + 'api/info-backgrounds',
      data: {
        type: 5
      },
      header: header,
      method: 'GET',
      success: res => {
        if (res.statusCode === 200) {
          if (res.data.code === 10000) {
            this.setData({
              banner: res.data.data.background,
            })
          }
        }
      }
    })
  },   
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.modal = this.selectComponent("#modal");
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  isRecruits: function () {
    console.log('this.data', this.options.type == 'recruits')
    if (this.options.type == 'recruits') {
      return 'recruits'
    } else {
      return 'seekers'
    }
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

})