// pages/home/new/new.js
const app = getApp()
Page({
  data: {
    focusInput: false,
    isTOP: false,
    tagList:[
      {
        id: 0,
        name: '找资金'
      },
      {
        id: 1,
        name: '找项目'
      },
      {
        id: 2,
        name: '找人'
      },
      {
        id: 3,
        name: '其他合作'
      }
    ],
    tagtype: 0,
    button_state: false,
    // 订阅模板消息
    isSetting: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    this.setData({
      groupId: options.groupId,
    })
    console.log("============new")
    console.log("options.groupId= " + options.groupId)
    // this.toast = this.selectComponent(".toast")
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
  tagTap: function (e) {
    const type = e.currentTarget.dataset.type
    this.setData({tagtype: type})
    console.log('tagtype', this.data.tagtype)
  },
  json2Form: function (json) {
    var str = [];
    for(var p in json){
    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(json[p]))
    }
    return str.join("&")
  },
  handleSubmit(e) {
    const type = this.data.tagtype
    const {
      value
    } = e.detail;
    const {
      enterpriseName, introduction, phone, email, wxId
    } = e.detail.value
    // if (enterpriseName == "" || introduction == "" || content == "" || phone == "" || email == "") {
    //   wx.showModal({
    //     title: '提示',
    //     content: '请输入完整信息！',
    //     success: function (res) {
    //       if (res.confirm) {
    //         console.log('用户点击确定')
    //       }
    //     }
    //   })
    // } 
     if (enterpriseName == "") {
      wx.showModal({
        title: '提示',
        content: '请输入合作标题',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
    } else if (phone == "") {
      wx.showModal({
        title: '提示',
        content: '请输入手机号码',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
     } else if (email == "") {
       wx.showModal({
         title: '提示',
         content: '请输入邮箱/微信',
         success: function (res) {
           if (res.confirm) {
             console.log('用户点击确定')
           }
         }
       })
     } else if (introduction == "") {
      // wx.showModal({
      //   title: '提示',
      //   content: '请输入合作介绍',
      //   success: function (res) {
      //     if (res.confirm) {
      //       console.log('用户点击确定')
      //     }
      //   }
      // })
     } else if (this.data.content == "" || this.data.content == undefined) {
        wx.showModal({
          title: '提示',
          content: '请输入合作介绍',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            }
          }
        })
     } 
    else {
      console.log('value', value)
      const subdata = {
        content: this.data.content,
        ...value,
        type: type,
        isTop: !this.data.isTOP ? '0' : '1',
        groupId: this.data.groupId
      }
      console.log('最终合作数据', subdata)
       // 避免重复提交
       this.setData({
         button_state: true
       })
       this.complete(subdata)
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
      //     console.log("requestSubscribeMessage")
      //     that.complete(subdata)
      //   },
      // })
    }
  },
  complete: function (subdata) {
    const that = this
    wx.request({
      url: app.globalData.cheerFishHost + 'api/cooperations',
      data: subdata,
      header: {
        'appId': app.globalData.appId,
        'userIdentity': app.globalData.userInfo ? app.globalData.userInfo.identity : ''
      },
      method: 'POST',
      success: res => {
        if (res.statusCode === 200) {
          if (res.data.code === 10000) {
            wx.showModal({
              title: '提醒',
              content: '订阅消息界面选择“总是”，才能获取审核结果和最新资讯！',
              showCancel: false,
              confirmText:'订阅',
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                  that.setModelInfo() 
                }
              }
            })
            // wx.showToast({
            //   title: '发布成功，审核中',
            //   icon: 'success',
            //   duration: 1000,
            //   mask: true
            // })
            // console.log('发布成功 res.data', res.data)
            // // this.toast.show('发布成功，等待审核，可在我的发布中查看进度')
            // setTimeout(function () {
            //   wx.switchTab({
            //     url: '/pages/partner/partner'
            //   })
            // }, 1000)
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
            this.setData({
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
      fail: res => {
        console.log('cooperations new false ', res)
        wx.showToast({
          title: res.errMsg,
          icon: 'none',
          duration: 2000
        })
        this.setData({
          button_state: false
        })
      }
    })
  },
  topTap: function (e) {
    // console.log('e', e)
    // console.log('isTop', this.data.isTOP ? '1' : '0')
    this.setData({
      isTOP: !this.data.isTOP
    })
  },
  bindTextAreaInput: function (e) {
    // console.log(e.detail.value)
    this.data.content = e.detail.value
  },
  blanceRules: function (e) {
    wx.navigateTo({
      url: '/pages/profile/blance/blance',
    })
  },  
  setTap: function (e) {
    this.setData({
      isSetting: !this.data.isSetting
    })
    wx.requestSubscribeMessage({
      tmplIds: [app.globalData.tmplId1, app.globalData.tmplId2],
      success(res) {
        console.log(res)
      },
      fail(res) {
        console.log(res)
      }, complete: function (res) {
        console.log("requestSubscribeMessage")
      },
    })
  },
  modelInfo: function (e) {
    wx.navigateTo({
      url: '/pages/profile/modelInfo/info',
    })
  },  
  setModelInfo: function(){
    // 成功后订阅模板消息后可報名成功
    const that = this
    wx.requestSubscribeMessage({
      tmplIds: [app.globalData.tmplId1, app.globalData.tmplId2],
      success(res) {
        console.log(res)
        wx.showToast({
          title: '发布成功，审核中',
          icon: 'success',
          duration: 2000
        })
        setTimeout(function () {
          // wx.hideToast()
          wx.navigateTo({
            url: '/pages/homepage/home?id=' + that.data.groupId,
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
                  title: '发布成功，审核中',
                  icon: 'success',
                  duration: 2000,
                  success: function () {
                    wx.navigateTo({
                      url: '/pages/homepage/home?id=' + that.data.groupId,
                    })
                  }
                })
                // setTimeout(function () {
                //   wx.navigateTo({
                //     url: '/pages/homepage/home?id=' + that.data.groupId,
                //   })
                // }, 1000)
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
        // wx.showToast({
        //   title: '发布成功，审核中',
        //   icon: 'success',
        //   duration: 2000
        // })
        // setTimeout(function () {
        //   // wx.hideToast()
        //   wx.switchTab({
        //     url: '/pages/partner/partner'
        //   })
        // }, 1000)
      },
    })
  }
})