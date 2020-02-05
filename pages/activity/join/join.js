// pages/activity/join/join.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    phone: '',
    company: '',
    position: '',
    type: '报名活动',
    isReports: '0',
    list: [],
    optionsIndex: 0,
    customList: [],
    loadingHidden: false,
    // 订阅模板消息
    isSetting:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      activityId: this.options.id,
    })
    this.fetchCustomList()
    this.fetchUserInfo()
  },
  fetchCustomList: function () {
    const that = this
    const url = app.globalData.cheerFishHost + 'api/activities/' + this.data.activityId
    wx.request({
      url: url,
      data: {},
      header: {
        'appId': app.globalData.appId,
        'userIdentity': app.globalData.userInfo ? app.globalData.userInfo.identity : ''
      },
      success: res => {
        // console.log('activity item ', JSON.stringify(res))
        setTimeout(function () {
          that.setData({
            loadingHidden: true
          });
        }, 300);
        if (res.statusCode === 200) {
          if (res.data.code === 10000) {
            const reslist = res.data.data
            this.data.isCustom = reslist.custom
            if (this.data.isCustom == 1) {
                this.data.list = JSON.parse(reslist.rules)
                for (let i = 0; i < this.data.list.length; i++) {
                  if (this.data.list[i].type == 'radio'
                    || this.data.list[i].type == 'checkbox') {
                    let options = Object.keys(this.data.list[i].options).map(key => ({
                      name: key,
                    }))
                    this.data.list[i].options = options
                  }
                }
                this.setData({
                  list: this.data.list,
                  customList: JSON.parse(reslist.rules),
                })
            }
            this.setData({
              title: reslist.title
            })
          }
        }
      }
    })
  },
  fetchUserInfo: function () {
    const header = {
      'appId': app.globalData.appId,
      'userIdentity': app.globalData.userInfo ? app.globalData.userInfo.identity : ''
    }
    wx.request({
      url: app.globalData.cheerFishHost + 'api/users/1',
      data: {},
      header: header,
      method: 'GET',
      success: res => {
        if (res.statusCode === 200) {
          if (res.data.code === 10000) {
            this.setData({
              name: res.data.data.userBaseInfo.name,
              phone: res.data.data.userBaseInfo.phone,
            })
          }
        }
      }
    })
  },
  bindTextAreaBlur: function (e) {
    console.log(e.detail.value)
    this.setData({
      content: e.detail.value
    })
  },
  confirm() {
    // const activityId = this.data.activityId
    const name = this.data.title
    const content = this.data.content
    const header = {
      'appId': app.globalData.appId,
      'userIdentity': app.globalData.userInfo ? app.globalData.userInfo.identity : ''
    }
    const itemType = this.data.itemType
    const itemId = this.data.itemId
    const type = '0'
    if (this.data.name == '') {
      wx.showToast({
        title: '请输入真实姓名',
      })
    } else if (this.data.phone == '') {
      wx.showToast({
        title: '请输入手机号码',
      })
    } else if (this.data.company == '') {
      wx.showToast({
        title: '请输入工作单位',
      })
    } else if (this.data.position == '') {
      wx.showToast({
        title: '请输入就职职务',
      })
    } else {
      for (let i = 0; i < this.data.list.length; i++) {
        if (this.data.customList[i].require) {
          if (this.data.customList[i].values == undefined ||
            this.data.customList[i].values == null) {
            wx.showToast({
              title: '请输入' + this.data.customList[i].label,
            })
            return
          }
        }
      }

      //成功后订阅模板消息后可報名成功
      // const that = this
      // wx.requestSubscribeMessage({
      //   tmplIds: [app.globalData.tmplId1, app.globalData.tmplId2],
      //   success(res) {
      //     console.log(res)
      //   },
      //   fail(res) {
      //     console.log(res)
      //   }, complete: function (res) { 
      //     that.confirmJoin()
      //   },
      // })

      this.confirmJoin()
    }

  },
  confirmJoin: function () {
    const rules = this.data.customList
    const that = this
    const data = {
      "activityId": this.data.activityId,
      "name": this.data.name,
      "phone": this.data.phone,
      "company": this.data.company,
      "position": this.data.position,
      custom: rules.length > 0 ? '1' : '0',
      rules: rules.length > 0 ? JSON.stringify(rules) : '',
    }
    wx.request({
      url: app.globalData.cheerFishHost + 'api/activity-registers',
      data: data,
      header: {
        'appId': app.globalData.appId,
        'userIdentity': app.globalData.userInfo.identity
      },
      method: 'POST',
      success: res => {
        console.log('item join success ', res)
        if (res.statusCode === 200) {
          if (res.data.code === 10000) {
            // wx.showToast({
            //   title: '报名成功',
            //   icon: 'success',
            //   duration: 2000
            // })
            // setTimeout(function () {
            //   wx.navigateBack()
            // }, 1000);
            // //更新详情界面预约button的效果
            // this.triggerEvent('updateUI', '1');
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
            console.log('item reports false ', res)
            wx.showToast({
              title: '报名失败,请联系客服',
              icon: 'success',
              duration: 1000
            })
          }
        }
      },
      fail: res => {
        console.log('item reports false ', res)
        wx.showToast({
          title: '服务器忙',
          icon: 'success',
          duration: 1000
        })
      }
    })
  },
  cancel() {
    wx.navigateBack()
  },
  bindinput(e) {
    const idx = e.currentTarget.dataset.idx
    if (idx >= 0) {
      this.data.list[idx].values = e.detail.value
      this.data.customList[idx].values = e.detail.value
    }
    this.setData({
      [e.currentTarget.dataset.name]: e.detail.value,
    })
  },
  onPickerChangeHandler: function (e) {
    const idx = e.currentTarget.dataset.idx
    this.data.customList[idx].values = e.detail.value
  },
  checkboxChange: function (e) {
    const idx = e.currentTarget.dataset.idx
    this.data.customList[idx].values = e.detail.value.join(',')
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
  setTap: function (e) {
    this.setData({
      isSetting: !this.data.isSetting
    })
  },
  setModelInfo: function (type) {
    // 成功后订阅模板消息后可報名成功
    const that = this
    wx.requestSubscribeMessage({
      tmplIds: [app.globalData.tmplId1, app.globalData.tmplId2],
      success(res) {
        // console.log("成功后订阅")
        // console.log(res)
        wx.showToast({
          title: '报名成功',
          icon: 'success',
          duration: 2000
        })
        setTimeout(function () {
          wx.navigateBack()
        }, 1000);
        //更新详情界面预约button的效果
        that.triggerEvent('updateUI', '1');
      },
      fail(res) {
        // console.log("成功后订阅")
        // console.log(res)
        wx.showModal({
          title: '提示',
          content: '需要您授权打开订阅消息',
          showCancel: false,
          success: modalSuccess => {
            wx.openSetting({
              success(settingdata) {
                wx.showToast({
                  title: '报名成功',
                  icon: 'success',
                  duration: 2000
                })
                setTimeout(function () {
                  wx.navigateBack()
                }, 1000);
                //更新详情界面预约button的效果
                that.triggerEvent('updateUI', '1');
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
        // console.log("成功后订阅 complete")
        // console.log("requestSubscribeMessage")
        // wx.showToast({
        //   title: '报名成功',
        //   icon: 'success',
        //   duration: 2000
        // })
        // setTimeout(function () {
        //   wx.navigateBack()
        // }, 1000);
        // //更新详情界面预约button的效果
        // that.triggerEvent('updateUI', '1');
      },
    })
  }
})