// pages/home/new/new.js
const app = getApp()
Page({
  data: {
    focusInput: false,
    isTOP: false,
    currentTab: '',
    button_state: false,
    // 订阅模板消息
    isSetting: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options', options)
    wx.hideShareMenu()
    this.setData({
      currentTab: options.type,
      groupId: options.groupId
    })
    if (options.type == '0') {
      wx.setNavigationBarTitle({
        title: '发布找干将信息'
      })
    } else{
      wx.setNavigationBarTitle({
        title: '发布找主公信息'
      })
    }
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
  json2Form: function (json) {
    var str = [];
    for(var p in json){
    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(json[p]))
    }
    return str.join("&")
  },
  reruitSubmit(e) {
    const {
      value
    } = e.detail;
    const {
      enterpriseName, position, jobDes, jobRequire, jobAddress, otherInfo,phone,email,wxId
    } = e.detail.value
    if (enterpriseName == "") {
      wx.showModal({
        title: '提示',
        content: '请输入单位名称',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
    } else if (position == "" ) {
      wx.showModal({
        title: '提示',
        content: '请输入职位名称',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
    } else if (phone == "") {
      wx.showModal({
        title: '提示',
        content: '请输入手机号码！',
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
    } else if (jobDes == "") {
      wx.showModal({
        title: '提示',
        content: '请输入职务需求',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
    } else if (jobAddress == "") {
      wx.showModal({
        title: '提示',
        content: '请输入工作地点',
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
        ...value,
        isTop: !this.data.isTOP ? '0' : '1',
        groupId: this.data.groupId
      }
      console.log('最终数据', subdata)
      // const formData = this.json2Form(subdata);
      // console.log('formData', formData)
      // 避免重复提交
      this.setData({
        button_state: true
      })
      //成功后订阅模板消息后可報名成功
      const that = this
      wx.requestSubscribeMessage({
        tmplIds: [app.globalData.tmplId1, app.globalData.tmplId2],
        success(res) {
          console.log(res)
        },
        fail(res) {
          console.log(res)
        }, complete: function (res) {
          console.log("requestSubscribeMessage")
          that.complete(subdata)
        },
      })
    }
  },
  complete: function (subdata){
    const that = this
    wx.request({
      url: app.globalData.cheerFishHost + 'api/recruits',
      data: subdata,
      header: {
        'appId': app.globalData.appId,
        'userIdentity': app.globalData.userInfo ? app.globalData.userInfo.identity : ''
      },
      method: 'POST',
      success: res => {
        console.log('commitRecruit success ', res)
        if (res.statusCode === 200) {
          if (res.data.code === 10000) {
            // wx.showToast({
            //   title: '发布成功，审核中',
            //   icon: 'success',
            //   duration: 2000
            // })
            // // this.toast.show('发布成功，等待审核，可在我的发布中查看进度')
            // setTimeout(function () {
            //   wx.switchTab({
            //     url: '/pages/job/job?type=0'
            //   })
            // }, 1000)
            wx.showModal({
              title: '提醒',
              content: '订阅消息界面选择“总是”，才能获取审核结果和最新资讯！',
              showCancel: false,
              confirmText: '订阅',
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                  that.setModelInfo(0)
                }
              }
            })
          } else {
            console.log('commitRecruit 发布失败 ', res.data.msg)
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
          this.setData({
            button_state: false
          })
        }
      },
      fail: res => {
        console.log('commitRecruit 发布失败 ', res.errMsg)
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
  cooperationSubmit(e) {
    const { position, content,phone, email } = e.detail.value
    if (position == "") {
      wx.showModal({
        title: '提示',
        content: '请输入职务意向',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
    } else if (content == "") {
      wx.showModal({
        title: '提示',
        content: '请输入求职内容',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
    } else if (phone == "") {
      wx.showModal({
        title: '提示',
        content: '请输入联系电话',
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
    }  else {
      const subdata = {
        ...e.detail.value,
        isTop: !this.data.isTOP ? '0' : '1'
      }
      console.log('最终数据', subdata)
      // const formData = this.json2Form(subdata);
      // console.log('formData', formData)
      this.setData({
        button_state: true
      })
      const that = this
      wx.request({
        url: app.globalData.cheerFishHost + 'api/seekers',
        data: subdata,
        header: {
          // "Content-Type": "application/x-www-form-urlencoded",
          'appId': app.globalData.appId,
          'userIdentity': app.globalData.userInfo ? app.globalData.userInfo.identity : ''
        },
        method: 'POST',
        success: res => {
          console.log('commitSeeker success ', res)
          if (res.statusCode === 200) {
            if (res.data.code === 10000) {
              wx.showModal({
                title: '提醒',
                content: '订阅消息界面选择“总是”，才能获取审核结果和最新资讯！',
                showCancel: false,
                confirmText: '订阅',
                success: function (res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                    that.setModelInfo(1)
                  }
                }
              })
              // wx.showToast({
              //   title: '发布成功，审核中',
              //   icon: 'success',
              //   duration: 2000
              // })
              // setTimeout(function () {
              //   wx.switchTab({
              //     url: '/pages/job/job?type=1'
              //   })
              // }, 1000)
            } else {
              console.log('seekers 发布失败 ',  res.data.msgs)
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
            this.setData({
              button_state: false
            })
          }
        },
        fail: res => {
          console.log('seekers 发布失败 ', res.errMsg)
          wx.showToast({
            title: res.errMsg,
            icon: 'none',
            duration: 2000
          })
          this.setData({
            button_state: false
          })
        },
        complete: res => {
        }
      })
    }
  },
  topTap: function (e) {
    console.log('e', e)
    console.log('isTop', this.data.isTOP ? '1' : '0')
    this.setData({
      isTOP: !this.data.isTOP
    })
  },
  bindTextAreaInput: function (e) {
    console.log(e.detail.value)
    if (this.data.currentTab.type == '0') {
      this.data.jobDes = e.detail.value
    } else {
      this.data.content = e.detail.value
    }
  },
  blanceRules: function (e) {
    wx.navigateTo({
      url: '/pages/profile/blance/blance',
    })
  },  
  modelInfo: function (e) {
    wx.navigateTo({
      url: '/pages/profile/modelInfo/info',
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
  setModelInfo: function (type) {
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
        //     url: '/pages/job/job?type=' + type
        //   })
        // }, 1000)
      },
    })
  }
})