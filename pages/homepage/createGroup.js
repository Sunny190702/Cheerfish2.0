// pages/homepage/createGroup.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  onChooseHeaderHandler: function () {
    wx.chooseImage({
      count: 1, //最多可以选择的图片总数  
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'],
      success: res => {
        // this.headerFilePath = res.tempFilePaths[0]
        this.setData({
          // pic: this.headerFilePath
          pic: res.tempFilePaths,
          picPath: res.tempFilePaths[0],
        })
      }
    })
  },
  handleSubmit(e) {
    const data = e.detail.value
    console.log('data', e)
    const {
      name,
      introduced,
      reason,
    } = e.detail.value
    const filePath = this.data.filePath

    if(this.data.picPath == "") {
      wx.showModal({
        title: '提示',
        content: '请输入活动图片',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
    } else if (name == "") {
      wx.showModal({
        title: '提示',
        content: '请输入真实小圈名称',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
    } else if (introduced == "") {
      wx.showModal({
        title: '提示',
        content: '请输入小圈简介',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
    } else if (reason == "") {
      wx.showModal({
        title: '提示',
        content: '请输入创建说明',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
    } else {
      this.postCompleteUserInfo(data)
    }
  },
  postCompleteUserInfo(data) {
    const userinfo = {
      ...data
    }
    console.log('最终用户数据')
    wx.uploadFile({
      url: app.globalData.cheerFishHost + 'completeUserInfo',
      filePath: this.data.filePath,
      name: 'header',
      formData: userinfo,
      header: {
        'content-type': 'multipart/form-data',
        'appId': app.globalData.appId,
        'userIdentity': app.globalData.userInfo ? app.globalData.userInfo.identity : ''
      },
      method: 'POST',
      success: res => {
        const resJosn = JSON.parse(res.data)
        console.log('resJosn', resJosn)
        if (resJosn.code == 10000) {
          wx.showToast({
            title: '注册成功',
            icon: 'success',
            duration: 2000
          })
          console.log('uploadFile success', res.data)

          wx.switchTab({
            url: '/pages/homepage/groups'
          })
        } else {
          console.log('res', res)
          wx.showToast({
            title: '注册失败',
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail: res => {
        console.log('uploadFile false', res)
      }
    })
  },
  onCompleteUserInfoHandler: function (e) {
    console.log(e.detail.value)
    let formData = e.detail.value
    if (formData.header === '') {
      this._showTipDialog('请输入小圈LOGO')
      return
    }
    if (formData.name === '') {
      this._showTipDialog('请输入小圈名称')
      return
    }
    if (formData.introduced === '') {
      this._showTipDialog('请输入小圈简介')
      return
    }
    this.createGroup(formData)
  },
  createGroup: function (data) {
    const pic = this.data.picPath
    const that = this
    console.log("====createGroup====")
    console.log(JSON.stringify(data))
    wx.uploadFile({
      url: app.globalData.cheerFishHost + 'commitGroup',
      filePath: pic,
      name: 'pic',
      formData: data,
      header: {
        'content-type': 'multipart/form-data',
        'userIdentity': app.globalData.userInfo ? app.globalData.userInfo.identity : '',
        'appId': app.globalData.appId,
      },
      method: 'POST',
      success(res) {
        console.log('commitGroup success res is ', JSON.stringify(res))
        const resJosn = JSON.parse(res.data)
        console.log('resJosn', resJosn)
        if (res.statusCode === 200) {
          if (resJosn.code == 10000) {
            wx.showModal({
              title: '提醒',
              content: '订阅消息界面选择“总是”，才能获取审核结果和最新资讯！',
              showCancel: false,
              confirmText: '订阅',
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                  that.setModelInfo()
                }
              }
            })
          } else {
            console.log('commitGroup code !== 10000 ', resJosn)
            wx.showToast({
              title: resJosn.msg,
              icon: 'none',
              duration: 2000,
              mask: true
            })
            that.setData({
              button_state: false
            })
          }
        } else {
          wx.showToast({
            title: '网络错误',
            icon: 'none',
            duration: 2000,
            mask: true
          })
          that.setData({
            button_state: false
          })
        }
      },
      fail(err) {
        console.log('commitGroup false ' + err.errMsg)
        wx.showToast({
          title: err.errMsg,
          icon: 'none',
          duration: 2000,
          mask: true
        })
      }
    })
  },
  setModelInfo: function () {
    // 成功后订阅模板消息后可報名成功
    const that = this
    wx.requestSubscribeMessage({
      tmplIds: [app.globalData.tmplId1, app.globalData.tmplId2],
      success(res) {
        console.log(res)
        wx.showToast({
          title: '创建成功',
          icon: 'success',
          duration: 2000
        })
        setTimeout(function () {
          wx.switchTab({
            url: '/pages/homepage/groups'
          })
        }, 1000)
      },
      fail(res) {
        console.log(res)
        wx.showModal({
          title: '提示',
          content: '需要您授权打开订阅消息',
          showCancel: false,
          success: modalSuccess => {
            wx.openSetting({
              success(settingdata) {
                wx.showToast({
                  title: '创建成功',
                  icon: 'success',
                  duration: 2000
                })
                setTimeout(function () {
                  wx.switchTab({
                    url: '/pages/homepage/groups'
                  })
                }, 1000)
              },
              fail(failData) {
                console.log("failData", failData)
              },
              complete(finishData) {
                console.log("finishData", finishData)
              }
            })
          }
        })
      }, complete: function (res) {
        console.log("requestSubscribeMessage")
      },
    })
  }
})