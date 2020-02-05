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
    list: [],
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
      obj[a].hot = obj[a].hot + 1
      if (obj[a].state >= 0 && obj[a].state != 1 && this.data.show == 1) {
        wx.navigateTo({
          url: "/pages/partner/detail/detail_under?id=" + id
        })
      } else {
        wx.navigateTo({
          url: "/pages/partner/detail/detail?id=" + id
        })
      }      
      setTimeout(() => {
        that.setData({ list: obj })
      }, 1000);
    },
    advisory(e) {
      console.log('e', e);
      const id = e.target.id
      const cooperation = this.data.list.find(function (x) {
        return x.id == id
      })
      console.log('cooperation', cooperation)
      wx.showModal({
        title: '联系',
        showCancel: false,
        confirmText: '返回',
        content: '电话:' + cooperation.phone + ',' + '\r\n' + '邮箱:' + cooperation.email,
        success(res) {
          if (res.confirm) {
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },
    delete(e) {
      const _this = this
      console.log('e', e);
      const id = e.target.id
      const header = {
        'appId': app.globalData.appId,
        'userIdentity': app.globalData.userInfo ? app.globalData.userInfo.identity : ''
      }
      const getUrl = app.globalData.cheerFishHost + 'api/cooperation-favorites/' + id
      wx.request({
        url: getUrl,
        data: { 'cooperationId': id },
        method: 'DELETE',
        header: header,
        success: res => {
          if (res.statusCode === 200) {
            if (res.data.code === 10000) {
              console.log('res', res)
              console.log('list restruct begin', _this.data.list)
              const arr = _this.restructureArr(_this.data.list, id)
              console.log('arr', arr)
              _this.setData({
                list: arr
              })
              console.log('list restruct after', _this.data.list)
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
          } else  {
            console.log('res', res)
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
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