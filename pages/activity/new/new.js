// pages/home/new/new.js
var util = require('../../../utils/util.js');
const app = getApp()
Page({
  data: {
    focusInput: false,
    currentDate: {},
    defaultStartTime: true,
    startTime: '',
    startDay: '',
    time: '',
    defaultEndTime: true,
    endTime: '',
    endDay: '',
    defaultDeadLineTime: true,
    deadLineTime: '',
    deadLineDay: '',
    date: '2019-09-01',
    isTOP: false,
    pic: '/images/default/upload.png',
    text: '点击上传图片',
    picPath: '',
    tagList:[
      {
        id: 0,
        name: '论坛'
      },
      {
        id: 1,
        name: '沙龙'
      },
      {
        id: 2,
        name: '聚餐'
      },
      {
        id: 3,
        name: '其他'
      }
    ],
    tagtype: 0,
    inputvalue: {},
    button_state: false,
    // 订阅模板消息
    isSetting: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.toast = this.selectComponent(".toast")
    var time = util.formatTime(new Date())
    // 再通过setData更改Page()里面的data，动态更新页面的数据
    this.setData({
      currtime: time,
      groupId: options.groupId
    })
    wx.hideShareMenu()
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
  log1(e) {
    const value = e.detail.value
    this.setData({content: value})
  },
  json2Form: function (json) {
    var str = [];
    for(var p in json){
    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(json[p]))
    }
    return str.join("&")
  },
  uploadimg:function(e){
    const that = this;
    wx.chooseImage({  //从本地相册选择图片或使用相机拍照
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success:function(res){
      //前台显示 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
      const tempFilePaths = res.tempFilePaths
      //  console.log('tempFilePaths[0]', tempFilePaths[0])
      that.setData({
          pic: res.tempFilePaths,
          picPath: tempFilePaths[0],
          // text: '重新上传'
          text: ''
        })
      }
    })
  },
  bindDeadLineDayChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      deadLineDay: e.detail.value
    })
  },
  bindDeadLineTimeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      deadLineTime: e.detail.value,
      defaultDeadLineTime: false
    })
  },  
  bindEndDayChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      endDay: e.detail.value
    })
  },
  bindEndTimeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      endTime: e.detail.value,
      defaultEndTime : false
    })
  },  
  bindStartDayChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      startDay: e.detail.value
    })
  },
  bindStartTimeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      startTime: e.detail.value,
      defaultStartTime: false
    })
  },
  handleSubmit(e) {
    const {
      value
    } = e.detail;
    const {
      // address, author, cost, deadLineDay, content, endDay, regNum, startDay, title
      address, author, cost, deadLineDay, endDay, regNum, startDay, title
    } = e.detail.value
    const type = this.data.tagtype
    if (title == "") {
      wx.showModal({
        title: '提示',
        content: '请输入活动标题',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
    } else if (startDay == "") {
      wx.showModal({
        title: '提示',
        content: '请输入活动开始日期',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
    } else if (endDay == "") {
      wx.showModal({
        title: '提示',
        content: '请输入活动结束日期',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
    } else if (address == "") {
      wx.showModal({
        title: '提示',
        content: '请输入活动地址',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }         
        }
      })
    } else if (deadLineDay == "") {
      wx.showModal({
        title: '提示',
        content: '请输入报名截至日期',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
    } else if (author == "" ) {
      wx.showModal({
        title: '提示',
        content: '请输入主办单位',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
    // } else if (content == "") {
    } else if (this.data.content == "" || this.data.content == undefined) {
      wx.showModal({
        title: '提示',
        content: '请输入活动详情描述',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
    } else if (this.data.picPath == "") {
      wx.showModal({
        title: '提示',
        content: '请输入活动图片',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
    } else if (!this.checkTime()) {
      console.log('时间错误')
    }
    else {
      if (cost == "") {
        e.detail.value.cost = 0
      }
      if (regNum == "") {
        e.detail.value.regNum = 999999
      }
      if (this.data.defaultStartTime) {
        e.detail.value.start = e.detail.value.startDay + " " +  "00:00:00"
      } else {
        e.detail.value.start = e.detail.value.startDay + " " + e.detail.value.startTime + ":00"
      }

      if (this.data.defaultEndTime) {
        e.detail.value.end = e.detail.value.endDay + " " + "23:59:00"
      } else {
        e.detail.value.end = e.detail.value.endDay + " " + e.detail.value.endTime + ":00"
      }

      if (this.data.defaultDeadLineTime) {
        e.detail.value.deadLine = e.detail.value.deadLineDay + " " + "23:59:00"
      } else {
        e.detail.value.deadLine = e.detail.value.deadLineDay + " " + e.detail.value.deadLineTime + ":00"
      }

      // console.log("startTime is " + e.detail.value.startTime)
      // console.log("start is " + e.detail.value.start)

      const rules = this.data.customlist
      const rulesLength = rules ? rules.length : 0
      console.log("rulesLength = " + rulesLength)
      if (rulesLength == 0) {
        const that = this
        wx.showModal({
          title: '未设置自定义报名选，是否发布活动？',
          content: '',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
              const subdata = {
                content: that.data.content,
                ...value,
                type: type,
                isTop: !that.data.isTOP ? '0' : '1',
                custom: 0,
              }
              console.log('最终活动数据', subdata)
              //避免重复提交
              that.setData({
                button_state: true
              })
              that.commitActivity(subdata)
            } 
          }
        })
      } else {
        const subdata = {
          ...value,
          type: type,
          isTop: !this.data.isTOP ? '0' : '1',
          custom: rulesLength > 0 ? '1' : '0',
          rules: rulesLength > 0 ? JSON.stringify(rules) : '',
          groupId: this.data.groupId
        }
        console.log('最终活动数据', subdata)
        //避免重复提交
        this.setData({
          button_state: true
        })
        this.commitActivity(subdata)
      }
    }
  },
  commitActivity(data){
    //成功后订阅模板消息后可報名成功
    const that = this
    that.complete(data)
    // wx.requestSubscribeMessage({
    //   tmplIds: [app.globalData.tmplId1, app.globalData.tmplId2],
    //   success(res) {
    //     console.log(res)
    //   },
    //   fail(res) {
    //     console.log(res)
    //   }, complete: function (res) {
    //     console.log("requestSubscribeMessage")
    //     that.complete(data)
    //   },
    // })
  },
  complete: function(data){
    console.log('pic', this.data.picPath)
    const pic = this.data.picPath
    const that = this
    wx.uploadFile({
      url: app.globalData.cheerFishHost + 'commitActivity',
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
        console.log('commitActivity success res is ', JSON.stringify(res))
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
            // console.log('commitActivity success ', resJosn)
            // wx.showToast({
            //   title: '发布成功，审核中',
            //   icon: 'success',
            //   duration: 2000,
            //   mask: true
            // })
            // // this.toast.show("发布成功，等待审核，可在我的发布中查看进度")
            // setTimeout(function () {
            //   // wx.hideToast()
            //   wx.switchTab({
            //     url: '/pages/activity/activity'
            //   })
            // }, 1000)
          } else {
            console.log('commitActivity code !== 10000 ', resJosn)
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
        console.log('commitActivity false ' + err.errMsg)
        wx.showToast({
          title: err.errMsg,
          icon: 'none',
          duration: 2000,
          mask: true
        })
        that.setData({
          button_state: false
        })
      }
    })
  },
  topTap: function (e) {
    console.log('e', e)
    console.log('isTop', this.data.isTOP ? '1' : '0')
    this.setData({
      isTOP: !this.data.isTOP
    })
  },
  blanceRules: function (e) {
    wx.navigateTo({
      url: '/pages/profile/blance/blance',
    })
  },  
  tagTap: function (e) {
    const type = e.currentTarget.dataset.type
    this.setData({tagtype: type})
    console.log('tagtype', this.data.tagtype)
  },
  postCourse(data) {
    wxRequest({
      url: api.courses.newCourse.url,
      method: api.courses.newCourse.method,
      data,
      loadTitle: '创建中',
      success: res => {
        logger('创建课程成功', res)
        const path = '/pages/course/detail/detail?id=' + res._id
        wx.redirectTo({
          url: path
        })
      },
      fail: res => {
        logger('创建课程失败', res)
      }
    })
  },
  checkTime: function() {
    // console.log("this.data.currtime  : " + this.data.currtime )
    // var aaa = this.data.currtime - this.data.endDay
    // console.log("this.data.endTime  : " + this.data.endTime)
    // 开始时间应小于结束时间
    if (!this.data.startTime) {
      this.data.startTime = '00:00'
    }
    if (!this.data.endTime) {
      this.data.endTime = '23:59'
    }
    if (!this.data.deadLineTime) {
      this.data.deadLineTime = '23:59'
    }    
    console.log("this.data.startTime  : " + this.data.startTime)
    console.log("this.data.endTime  : " + this.data.endTime)
    console.log("this.data.deadLineTime  : " + this.data.deadLineTime)
    if (this.data.startDay > this.data.endDay) {
      wx.showModal({
        title: '提示',
        content: '活动结束日期应晚于开始日期',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
      return false
    } else if (this.data.startDay == this.data.endDay && this.data.startTime > this.data.endTime) {
      wx.showModal({
        title: '提示',
        content: '活动结束时间应晚于开始时间',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
      return false
    }
    // 活动结束时间应晚于报名截至时间
    else if (this.data.deadLineDay > this.data.endDay) {
      wx.showModal({
        title: '提示',
        content: '活动结束日期应晚于报名截至日期',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
      return false
    } else if (this.data.deadLineDay == this.data.endDay && this.data.deadLineTime > this.data.endTime) {
      wx.showModal({
        title: '提示',
        content: '活动结束时间应晚于报名截至时间',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
      return false
    }
    // 结束时间应晚于当前时间
    // else if (this.data.currtime - this.data.endDay >= 0) {
    //   wx.showModal({
    //     title: '提示',
    //     content: '活动结束日期应晚于今日',
    //     success: function (res) {
    //       if (res.confirm) {
    //         console.log('用户点击确定')
    //       }
    //     }
    //   })
    //   return false
    // } 
    // 报名截至时间应晚于当前时间
    // else if (this.data.currtime >= this.data.deadLineDay) {
    //   wx.showModal({
    //     title: '提示',
    //     content: '报名截至日期应晚于今日',
    //     success: function (res) {
    //       if (res.confirm) {
    //         console.log('用户点击确定')
    //       }
    //     }
    //   })
    //   return false
    // } 

    return true
  },

  editContent: function() {
    wx.navigateTo({
      url: '/pages/activity/new/content',
    })
  },
  setCustom: function () {
    var model = JSON.stringify(this.data.customlist);
    const rulesLength = this.data.customlist ? this.data.customlist.length : 0
    if (rulesLength > 0 ) {
      wx.navigateTo({
        url: '/pages/editor/custom-menu?model=' + model,
      })
    } else {
      wx.navigateTo({
        url: '/pages/editor/custom-menu',
      })
    }
  },
  bindTextAreaInput: function (e) {
    console.log(e.detail.value)
    this.data.content = e.detail.value
  },
  modelInfo: function () {
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
  setModelInfo: function () {
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
                  duration: 2000
                })
                setTimeout(function () {
                  // wx.hideToast()
                  wx.navigateTo({
                    // url: '/pages/activity/activity'
                    url: '/pages/homepage/home?id=' + that.data.groupId,
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
        // wx.showToast({
        //   title: '发布成功，审核中',
        //   icon: 'success',
        //   duration: 2000
        // })
        // setTimeout(function () {
        //   // wx.hideToast()
        //   wx.switchTab({
        //     url: '/pages/activity/activity'
        //   })
        // }, 1000)
      },
    })
  }
})