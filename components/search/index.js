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
  },
  methods: {
    goToSearchPage() {
      if (this.data.page == '') {
        wx.showToast({
          title: '参数错误',
          icon: 'none',
          duration: 2000
        })
      } else {
        wx.navigateTo({
          url: "/pages/searchPage/index?page="+this.data.page+'&title='+this.data.title
        })
      }
    }
  }
})