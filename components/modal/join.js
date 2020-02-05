// components/modal/join.js
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
    }
  },
  data: {
    show: false,
    height: '90%',
    name: '',
    phone: '',
    company: '',
    position: '',
    type: '报名活动',
    isReports: '0',
    list:[],
    optionsIndex:0,
    customList:[]
  },
  methods: {
    clickMask(e, customlist) {
      // console.log("e is "+ JSON.stringify(e))
      console.log("e=====",e)
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
                this.setData({
                  name: res.data.data.userBaseInfo.name,
                  phone: res.data.data.userBaseInfo.phone,
                  list:e,
                  show: !this.data.show,
                  customList: customlist,
                })
              }
            }
          }
        })
      }
      // this.setData({ show: !this.data.show })
    },
    bindTextAreaBlur: function (e) {
      console.log(e.detail.value)
      this.setData({
        content: e.detail.value
      })
    },
    confirm() {
      const activityId = this.data.itemId
      const name = this.data.title
      const content = this.data.content
      const that = this
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
        const rules = this.data.customList

        for (let i = 0; i < this.data.list.length; i++) {
            console.log("i = " +i)
          // if (rules[i].type === 'radio') {
          //   if (rules[i].values == undefined || rules[i].values == null) {
          //     let fields = Object.keys(this.data.customList[i].options).map(key => ({
          //       name: key,
          //     }))
          //     this.data.customList[i].values = fields[0].name
          //   } else {
          //     this.data.customList[i].values = rules[i].values
          //   }

          // }


          if (this.data.customList[i].require) {
            if (this.data.customList[i].values == undefined || 
            this.data.customList[i].values == null){
              wx.showToast({
                title: '请输入' + this.data.customList[i].label,
              })
              return
            }
          }
        }

        const data = {
          "activityId": activityId,
          "name": this.data.name,
          "phone": this.data.phone,
          "company": this.data.company,
          "position": this.data.position,
          custom: rules.length > 0 ? '1' : '0',
          rules: rules.length > 0 ? JSON.stringify(rules) : '',
        }
        console.log("activityId is " + activityId)
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
      }

    },
    cancel() {
      this.setData({ show: false })
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
      // console.log("=========== e is "+ JSON.stringify(e))
      // //自定义列表中第几项
      // const idx = e.currentTarget.dataset.idx
      // //将选中的选项value设为1
      // let fields = Object.keys(this.data.customList[idx].options).map(key => ({
      //   name: key,
      // }))

      // //将单选内容设置到list中用于发布
      // this.data.customList[idx].value = fields[e.detail.value].name

      // this.setData({
      //   optionsIndex: e.detail.value,
      // })
      const idx = e.currentTarget.dataset.idx
      this.data.customList[idx].values = e.detail.value
    },
    checkboxChange: function (e) {
      // console.log("=========== e is " + JSON.stringify(e))
      const idx = e.currentTarget.dataset.idx
      this.data.customList[idx].values = e.detail.value.join(',')
      // console.log("=========== e is " + JSON.stringify(this.data.customList))
    },
    setModelInfo: function () {
      // 成功后订阅模板消息后可報名成功
      const that = this
      wx.requestSubscribeMessage({
        tmplIds: [app.globalData.tmplId1, app.globalData.tmplId2],
        success(res) {
          console.log("授权  setModelInfo sucess")
          console.log(res)
            wx.showModal({
              title: '提示',
              content: '需要您授权保存相册',
              showCancel: false,
              success: modalSuccess => {
                wx.openSetting({
                  success(settingdata) {
                    console.log("settingdata", settingdata)
                    if (settingdata.authSetting['scope.writePhotosAlbum']) {
                      wx.showModal({
                        title: '提示',
                        content: '获取权限成功,再次点击图片即可保存',
                        showCancel: false,
                      })
                    } else {
                      wx.showModal({
                        title: '提示',
                        content: '获取权限失败，将无法保存到相册哦~',
                        showCancel: false,
                      })
                    }
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
        },
        fail(res) {
          console.log(res)
          console.log("授权  setModelInfo fail")
        }, complete: function (res) {
          console.log("授权  setModelInfo fail")
          console.log("requestSubscribeMessage")
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
        }
      })
    }
  }
})