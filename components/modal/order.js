// components/modal/order.js
const app = getApp()
Component({
  properties: {
    show: {
      type: Boolean,
      value: true
    },
    title: {
      type: String,
      value: ''
    },
    itemType: {
      type: String,
      value: ''
    },
    itemId: {
      type: String,
      value: ''
    },
  },
  data: {
    show: false,
    height: '58%',
    name: '',
    phone:'',
    company:'',
    position:'',
    type: '预约课程',
    // 订阅模板消息
    isSetting: true,
  },
  methods: {
    clickMask() {
      if (!this.data.show) {
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
            // console.log("clickMask=========", res )
            if (res.statusCode === 200) {
              if (res.data.code === 10000) {
                // console.log("userBaseInfo=========", res.data.data.userBaseInfo)
                this.setData({ 
                  name: res.data.data.userBaseInfo.name,
                  phone: res.data.data.userBaseInfo.phone
                })
              }
            }
          }
        })
      }
      this.setData({ show: !this.data.show })
    },
    bindTextAreaBlur: function (e) {
      console.log(e.detail.value)
      this.setData({
        content: e.detail.value
      })
    },
    confirm() {
      const name = this.data.title
      const content = this.data.content
      if (this.data.name == '') {
        wx.showToast({
          title: '请输入真实姓名',
          icon: 'none'
        })
      } else if (this.data.phone == '') {
        wx.showToast({
          title: '请输入手机号码',
          icon: 'none'
        })
      }else  if (this.data.company == '') {
        wx.showToast({
          title: '请输入工作单位',
          icon: 'none'
        })
      } else if (this.data.position == '') {
        wx.showToast({
          title: '请输入就职职务',
          icon: 'none'
        })
      }else {
        this.confirmOrder()
      }

    },
    confirmOrder:function(){
      const that = this
      const header = {
        'appId': app.globalData.appId,
        'userIdentity': app.globalData.userInfo ? app.globalData.userInfo.identity : ''
      }
      wx.request({
        url: app.globalData.cheerFishHost + 'api/course-registers',
        data: {
          "courseId": this.data.itemId,
          "name": this.data.name,
          "position": this.data.position,
          "phone": this.data.phone,
          "company": this.data.company
        },
        header: header,
        method: 'POST',
        success: res => {
          console.log('item reports success ', res)
          if (res.statusCode === 200) {
            if (res.data.code === 10000) {
              // wx.showToast({
              //   title: '预约成功',
              //   icon: 'success',
              //   duration: 2000
              // })
              // this.setData({
              //   show: false,
              // })
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
              wx.showToast({
                title: res.data.msg,
                icon: 'warn'
              })
              // console.log('item reports false ', res)
            }
          }
        },
        fail: res => {
          console.log('item reports false ', res)
        }
      })
    },
    cancel() {
      this.setData({ show: false })
    },
    bindinput(e) {
      console.log("ordermodal e is "+ JSON.stringify(e))  
      this.setData({
        [e.currentTarget.dataset.name]: e.detail.value
      })
    },
    setTap: function (e) {
      this.setData({
        isSetting: !this.data.isSetting
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
            title: '预约成功',
            icon: 'success',
            duration: 2000
          })
          that.setData({
            show: false,
          })
          //更新详情界面预约button的效果
          that.triggerEvent('updateUI', '1');
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
                    title: '预约成功',
                    icon: 'success',
                    duration: 2000
                  })
                  that.setData({
                    show: false,
                  })
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
          console.log("requestSubscribeMessage")
          // wx.showToast({
          //   title: '报名成功',
          //   icon: 'success',
          //   duration: 2000
          // })
          // that.setData({
          //   show: false,
          // })
          // //更新详情界面预约button的效果
          // that.triggerEvent('updateUI', '1');
        }
      })
    },
  }
})