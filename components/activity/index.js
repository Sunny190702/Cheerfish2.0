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
    show: '1',
    pictureHost: app.globalData.pictureHost,
    userLevelInfo: 0//app.globalData.userInfo.accountLevel,
  },
  methods: {
    goToDetailPage(e) {
      const that = this
      const id = e.currentTarget.id
      console.log('id', id)
      let item = that.data.list
      function pFn(p) { return p.id == id }
      const a = item.findIndex(pFn)
      console.log('q', a)
      let obj = item
      obj[a].hot = obj[a].hot+1
      if (obj[a].state >= 0 && obj[a].state != 1 && this.data.show == 1) {
        wx.navigateTo({
          url: "/pages/activity/detail/detail_under?id=" + id
        })
      } else {
        wx.navigateTo({
          url: "/pages/activity/detail/detail?id=" + id
        })
      }
      setTimeout(() => {
        that.setData({ list: obj })
      }, 1000);
    },
    delete(e) {
      const _this = this
      console.log('e', e);
      const id = e.target.id
      const getUrl = app.globalData.cheerFishHost + 'api/activity-favorites/' + id
      const header = {
        'appId': app.globalData.appId,
        'userIdentity': app.globalData.userInfo ? app.globalData.userInfo.identity : ''
      }
      wx.request({
        url: getUrl,
        data: {'activityId': id},
        method: 'DELETE',
        header: header,
        success: res => {
          if (res.statusCode === 200) {
            if (res.data.code === 10000) {
              console.log('res', res)
              console.log('activity restruct begin', _this.data.list)
              const arr = _this.restructureArr(_this.data.list, id)
              console.log('arr', arr)
              _this.setData({
                list: arr
              })
              console.log('activity restruct after', _this.data.list)
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
          }
        },
        fail: res => {
          console.log('delete false')
        }
      })
    },
    advisory(e){
      const userLevel = app.globalData.userInfo ? app.globalData.userInfo.accountLevel : 0
      console.log("userLevel is " + userLevel)
      if (userLevel > 0) {
        this.advisory1(e)
      } else {
        wx.navigateTo({
          url: "/pages/user/index?type=attest"
        })
      }
    },
    advisory1: function (e) {
      const that = this
      console.log('e', e);
      const id = e.target.id
      const act = that.data.list.find(function (x) {
        return x.id == id
      })
      console.log('act', act)
      function pFn(p){return p.id == id }
      const list = that.data.list
      const a = list.findIndex(pFn)
      if (act.isRegister == '1') {
        wx.showToast({
          title: '您已报名过该课程,请在个人中查看',
          icon: 'none',
          duration: 2000
        })
      } else {
        wx.showModal({
          title: '活动报名',
          content: '报名:' + act.title + '\r\n' +
                   '地点:' + act.address + '\r\n' +
                   '时间:' + act.start.substring(0, 10),
          success(res) {
            if (res.confirm) {
              wx.request({
                url: app.globalData.cheerFishHost + 'api/activity-registers',
                data: { "activityId": id },
                header: {
                  'appId': app.globalData.appId,
                  'userIdentity': app.globalData.userInfo ? app.globalData.userInfo.identity : ''
                },
                method: 'POST',
                success: res => {
                  if (res.statusCode === 200) {
                    if (res.data.code === 10000) {
                      let obj = that.data.list
                      obj[a].isRegister = '1'
                      obj[a].start = obj[a].start.substring(0, 10)
                      wx.showToast({
                        title: '报名成功',
                        icon: 'success',
                        duration: 2000
                      })
                      that.setData({list: obj})
                    } else {
                      wx.showToast({
                        title: '报名失败',
                        icon: 'success',
                        duration: 2000
                      })
                    }
                  } else {
                    wx.showToast({
                      title: '报名失败',
                      icon: 'success',
                      duration: 2000
                    })
                  }
                  console.log('act registers success ', res)
                },
                fail: res => {
                  console.log('act registers false ', res)
                }
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
    },
    restructureArr: function (dataArr, id) {
      var arr = [];
      for (var j = 0; j < dataArr.length; j++) {
        if (dataArr[j].id != id) {
          arr.push(dataArr[j]);
        }
      }
      return arr;
    },
  }
})