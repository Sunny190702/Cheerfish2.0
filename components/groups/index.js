// components/groups/index.js
const app = getApp()
Component({
  properties: {
    list: {
      type: Array,
      value: []
    },
    show: {
      type: String,
      value: ''
    }
  },
  data: {
    // list: [],
    pictureHost: app.globalData.pictureHost,
    userLevelInfo: 0
  },
  methods: {
    goToDetailPage(e) {
      const id = e.currentTarget.id
      wx.navigateTo({
        url: "/pages/homepage/home?id=" + id
      })
    },
  }
})