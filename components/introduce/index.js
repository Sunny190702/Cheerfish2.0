// components/introduce/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    show: true,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    clickMask() {
      this.setData({ show: !this.data.show })
      wx.setStorageSync("showAddInfo", '1')
    },
  }
})
