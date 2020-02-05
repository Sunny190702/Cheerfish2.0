const app = getApp()
Component({
  properties: {
    users: {
      type: Array,
      value: [{}, {}, {}]
    },
    regNums: {
      type: Number,
      value: 100
    },
    regNum: {
      type: Number,
      value: 93
    },
    itemId: {
      type: String,
      value: ''
    },
    type: {
      type: String,
      value: ''
    },
    identity: {
      type: String,
      value:''
    }
  },
  data: {
    pictureHost: app.globalData.pictureHost,
  },
  methods: {
    clickMask() {
      this.setData({ show: true })
    },
    bindTextAreaBlur: function (e) {
      console.log(e.detail.value)
      this.setData({
        content: e.detail.value
      })
    },
    goToReguserPage(e) {
      const identity = app.globalData.userInfo ? app.globalData.userInfo.identity : ''
      const publisherInfoId = e.currentTarget.dataset.identity
      // console.log('identity is ', identity + " ; publisherInfoId is ", publisherInfoId)
      // console.log('e', e)
      const id = e.currentTarget.dataset.id
      const type = e.currentTarget.dataset.type
      // if (type === '0' && identity === publisherInfoId) {
      //   wx.navigateTo({
      //     url: "/components/reguser/detail/index?id=" + id + '&type=' + type
      //   })
      // }
      var master = 0
      if (type === '0' && identity === publisherInfoId) {
        master = 1
      }
      wx.navigateTo({
        url: "/components/reguser/detail/index?id=" + id + '&type=' + type + '&master=' + master
      })
    },
    cancel() {
      this.setData({ show: false })
    }
  }
})