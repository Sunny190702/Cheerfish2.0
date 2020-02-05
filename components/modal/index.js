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
    height: '68%',
    content: '',
    type: '虚假信息',
    isReports: '0',
  },
  methods: {
    clickMask() {
      this.setData({show: !this.data.show})
    },
    bindTextAreaInput: function (e) {
      // console.log(e.detail.value)
      this.data.content = e.detail.value
    },    
    confirm() {
      const _this = this
      const name = _this.data.title
      const content = _this.data.content
      const header = {
        'appId': app.globalData.appId,
        'userIdentity': app.globalData.userInfo ? app.globalData.userInfo.identity : ''
      }
      const itemType = _this.data.itemType
      const itemId = _this.data.itemId
      const type = '0'
      console.log("举报 content is " + content)
      if (content == '') {
        wx.showModal({
          title: '提示',
          content: '请输入举报内容',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            }
          }
        })
      } else {
        wx.request({
          url: app.globalData.cheerFishHost + 'api/reports',
          data: {
            title: name,
            content,
            itemType,
            itemId,
            type},
          header: header,
          method: 'POST',
          success: res => {
            console.log('item reports success ', res)
            if (res.statusCode === 200) {
              if (res.data.code === 10000) {
                wx.showToast({
                  title: '举报成功',
                  icon: 'success',
                  duration: 2000
                })
                _this.setData({
                  show: false,
                  isReports: '1'
                })
              } else {
                wx.showToast({
                  title: '举报失败',
                  icon: 'success',
                  duration: 2000
                })
                _this.setData({
                  show: false,
                  isReports: '0'
                })
              }
            } else {
              wx.showToast({
                title: '举报失败',
                icon: 'success',
                duration: 2000
              })
              _this.setData({
                show: false,
                isReports: '0'
              })
            }
          },
          fail: res => {
            console.log('item reports false ', res)
          }
        })
      }

    },
    cancel() {
      this.setData({ show: false })
    }
  }
})