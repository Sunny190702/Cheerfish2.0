const app = getApp()
Component({
  properties: {
    collegeArray: {
      type: Array,
      value: []
    }
  },
  data: {},
  methods: {
    goToCollegePage(e) {
      const id = e.currentTarget.id
      console.log('id', id)
      wx.navigateTo({
        url: "../college/detail/detail?id=" + id
      })
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