const app = getApp()

Component({
  properties: {
    page: {
      type: String,
      value: ''
    },
    title: {
      type: String,
      value: ''
    }
  },
  data: {
    noResult: true
  },
  methods: {
    log(){
      console.log('add data', App.globalData)
    },
    searchPage() {
      if (this.data.page == '') {
        wx.showToast({
          title: '参数错误',
          icon: 'none',
          duration: 2000
        })
      } else {
        wx.navigateTo({
          url: "/pages/search/index?page="+this.data.page+'&title='+this.data.title
        })
      }
    }
  }
})