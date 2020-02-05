const app = getApp()
Component({
  properties: {
    job1: {
      type: Array,
      value: []
    },
    job2: {
      type: Array,
      value: []
    },
    show: {
      type: String,
      value: ''
    },
    isTab: {
      type: Boolean,
      value: false
    },
    currentTab: {
      type: Number,
      value: 0
    }
  },
  data: {
    currentTab: 0,
    job1: [],
    job2: [],
    pictureHost: app.globalData.pictureHost,
    userLevelInfo: 0//app.globalData.userInfo.accountLevel,
  },
  methods: {
    clickTab(e) {
      console.log('e', e);

      var that = this;
      if (this.data.currentTab === e.target.dataset.current) {
        return false;
      } else {
        that.setData({
          currentTab: e.target.dataset.current,
        })
      }
    },
    goToDetailPage(e) {
      const that = this
      const id = e.currentTarget.id
      const type = e.currentTarget.dataset.type
      let item = []
      if (type == 'recruits') {
        item = that.data.job1
      } else if (type == 'seekers') {
        item = that.data.job2
      }
      function pFn(p) { return p.id == id }
      const a = item.findIndex(pFn)
      console.log('q', a)
      let obj = item
      obj[a].hot = obj[a].hot + 1
      console.log('obj[a].state', obj[a].state)
      if (obj[a].state >= 0 && obj[a].state != 1 && this.data.show == 1) {
        wx.navigateTo({
          url: "/pages/job/detail/detail_under?id=" + id + '&type=' + type
        })
      } else {
        wx.navigateTo({
          url: "/pages/job/detail/detail?id=" + id + '&type=' + type
        })
      }           
      setTimeout(() => {
        if (type == 'recruits') {
          that.setData({ job1: obj })
        } else if (type == 'seekers') {
          that.setData({ job2: obj })
        }
      }, 1000);
    },
    advisory: function (e) {
      console.log('e', e);
      const id = e.target.id
      const type = e.target.dataset.type
      const recruit = type == 'job1' ? this.data.job1.find(function (x) {
        return x.id == id
      }) : this.data.job2.find(function (x) {
        return x.id == id
      })
      console.log('recruit', recruit)
      wx.showModal({
        title: '联系',
        content: '电话:' + '13412133311' + '\r\n' + '邮箱:' + '13412133311@139.com',
        showCancel: false,
        confirmText: '返回',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
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
      const type = e.target.dataset.type
      const recruit = type == 'job1' ? _this.data.job1.find(function (x) {
        return x.id == id
      }) : _this.data.job2.find(function (x) {
        return x.id == id
      })
      const header = {
        'appId': app.globalData.appId,
        'userIdentity': app.globalData.userInfo ? app.globalData.userInfo.identity : ''
      }
      console.log('recruit', recruit)
      const getUrl = type == 'job1' ? app.globalData.cheerFishHost + 'api/recruit-favorites/' + id : app.globalData.cheerFishHost + 'api/seeker-favorites/' + id
      const datatype = type == 'job1' ? { 'recruitId': id } : { 'seekerId': id }
      const arr = type == 'job1' ? _this.data.job1 : _this.data.job2
      wx.request({
        url: getUrl,
        data: datatype,
        method: 'DELETE',
        header: header,
        success: res => {
          if (res.statusCode === 200) {
            if (res.data.code === 10000) {
              console.log('res', res)
              if (type == 'job1') {
                console.log('job1 restruct begin', _this.data.job1)
                const arr = _this.restructureArr(_this.data.job1, id)
                console.log('arr', arr)
                _this.setData({
                  job1: arr
                })
                console.log('job1 restruct after', _this.data.job1)
              } else {
                const arr = _this.restructureArr(_this.data.job2, id)
                _this.setData({
                  job2: arr
                })
              }
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