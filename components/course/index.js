Component({
  properties: {
    list: {
      type: Array,
      value: []
    }
  },
  data: {

  },
  methods: {
    goToCoursePage(e) {
      const id = e.currentTarget.id
      console.log('id', id)
      wx.navigateTo({
        url: "/pages/home/course/course?id="+id
      })
    }
  }
})