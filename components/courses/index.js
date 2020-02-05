const app = getApp()
Component({
  properties: {
    coursesList: {
      type: Array,
      value: []
    },
    show: {
      type: String,
      value: ''
    },
  },
  data: {
    show: '1',
    pictureHost: app.globalData.pictureHost,
  },
  methods: {
    goToCoursePage: function (e) {
      const that = this
      const id = e.currentTarget.id
      console.log('id', id)
      let item = that.data.coursesList
      function pFn(p) { return p.id == id }
      const a = item.findIndex(pFn)
      console.log('q', a)
      let obj = item
      obj[a].hot = obj[a].hot+1
      wx.navigateTo({
        url: "/pages/home/course/course?id="+id
      })
      setTimeout(() => {
        that.setData({ coursesList: obj })
      }, 1000);
    },
    joinTap(e){
      const userLevel = app.globalData.userInfo ? app.globalData.userInfo.accountLevel : 0
      console.log("userLevel is " + userLevel)
      if (userLevel > 0) {
        this.joinTap1(e)
      } else {
        wx.navigateTo({
          url: "/pages/user/index?type=attest"
        })
      }
    },
    joinTap1: function (e) {
      const that = this
      const id = e.currentTarget.id
      let item = that.data.coursesList
      function pFn(p) { return p.id == id }
      const a = item.findIndex(pFn)
      console.log('q', a)
      const course = item[a]
      console.log('item', course)
      if (course.isRegister == '1') {
        wx.showToast({
          title: '您已预约咨询该课程',
          icon: 'none',
          duration: 2000
        })
      } else {
        wx.showModal({
          title: '课程咨询',
          content: '咨询:' + course.name,
          success(res) {
            if (res.confirm) {
              wx.request({
                url: app.globalData.cheerFishHost + 'api/course-registers',
                data: { "courseId": id },
                header: {
                  'appId': app.globalData.appId,
                  'userIdentity': app.globalData.userInfo ? app.globalData.userInfo.identity : ''
                },
                method: 'POST',
                success: res => {
                  if (res.statusCode === 200) {
                    if (res.data.code === 10000) {
                      let obj = item
                      obj[a].isRegister = '1'
                      that.setData({coursesList: obj})
                      wx.showToast({
                        title: '预约咨询成功',
                        icon: 'success',
                        duration: 2000
                      })
                    } else {
                      wx.showToast({
                        title: '预约咨询失败',
                        icon: 'success',
                        duration: 2000
                      })
                    }
                  } else {
                    wx.showToast({
                      title: '预约咨询失败',
                      icon: 'success',
                      duration: 2000
                    })
                  }
                  // that.setData({
                  //   list2[2].isRegister: '1'
                  // })
                  console.log('courseItem favorities success ', res)
                },
                fail: res => {
                  console.log('courseItem favorities false ', res)
                }
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
    },
    delete(e) {
      const _this = this
      console.log('e', e);
      const id = e.target.id
      console.log('id', id);
      wx.request({
        url: app.globalData.cheerFishHost + 'api/course-favorites/' + id,
        data: {'courseId': id},
        method: 'DELETE',
        header: {
          'appId': app.globalData.appId,
          'userIdentity': app.globalData.userInfo ? app.globalData.userInfo.identity : ''
        },
        success: res => {
          if (res.statusCode === 200) {
            if (res.data.code === 10000) {
              console.log('res', res)
              console.log('coursesList restruct begin', _this.data.coursesList)
              const arr = _this.restructureArr(_this.data.coursesList, id)
              console.log('arr', arr)
              _this.setData({
                coursesList: arr
              })
              console.log('coursesList restruct after', _this.data.coursesList)
              wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 2000
              })
            } else {
              console.log('res', res)
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 2000
              })
            }
          } else {
            wx.showToast({
              title: '网络错误',
              icon: 'none',
              duration: 2000,
            })
          }
        },
        fail: res => {
          console.log('delete false')
        }
      })
    },
    restructureArr: function (dataArr, id) {
      var arr = [];
      for (var j = 0; j < dataArr.length; j++) {
        if (dataArr[j].id != id) {
          arr.push(dataArr[j]);
        }
      }
      return arr;
    }
  }
})