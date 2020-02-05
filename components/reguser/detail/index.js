// pages/reguser/detail/index.js
const app = getApp()
Page({
  data: {
    list: [],
    pageNum: 1,
    pageNums: 1,
    customOptions: [],
    loadingHidden: false,
    systemInfo: app.globalData.systemInfo,
    copyListTitle:'活动报名表\n',
    copyList: '',
    // pictureHost: app.globalData.pictureHost,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options', this.options)
    this.getMore(1)
    wx.hideShareMenu()
    this.setData({
      master: options.master == 1 ? true : false
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // this.modal = this.selectComponent("#modal");
  },
  getMore(pageNum){
    pageNum = pageNum
    console.log('getMore pagenum', pageNum)
    const that = this;
    const id = that.options.id
    const apiUrl = that.options.type == '0' ? app.globalData.cheerFishHost + 'api/activity-reg-users' : app.globalData.cheerFishHost + 'api/course-reg-users'
    const Data = that.options.type == '0' ? {'pageNum': pageNum,'activityId': id} : {'pageNum': pageNum,'courseId': id}
    wx.request({
      url: apiUrl,
      data: Data,
      header: {
        'appId': app.globalData.appId,
        'userIdentity': app.globalData.userInfo ? app.globalData.userInfo.identity : ''
      },
      success: res => {
        setTimeout(function () {
          that.setData({
            loadingHidden: true
          });
        }, 300);
        if (res.statusCode === 200) {
          if (res.data.code === 10000) {
            let tmpArr = that.data.list;
            tmpArr.push.apply(tmpArr, res.data.data.list)
            const pagenum = that.data.pageNum+1
            const rows =  res.data.data.pageInfo.totalPageNums

            let index = this.data.customOptions ? this.data.customOptions.length : 0

            for (let i = index; i < tmpArr.length; i++) {
              if (tmpArr[i].registerInfo.custom == 1) {
                this.data.customOptions[i] = JSON.parse(tmpArr[i].registerInfo.rules)
              }
            }
            console.log("报名 tmpArr " + JSON.stringify(tmpArr))
            that.setData({
              list: tmpArr,
              pageNum: pagenum,
              pageNums: rows,
              customOptions: this.data.customOptions,
            })
          } else {
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
        wx.showToast({
          title: res.errMsg,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("systemInfo is " + this.data.systemInfo)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    const num = this.data.pageNum
    const nums = this.data.pageNums
    if (nums >= num) {
      this.getMore(num)
    } else {
      wx.showToast({
        title: '没有更多了!!!',
        icon: 'none',
        duration: 2500
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  copyRefuserList: function (e) {
    const that = this
    const list = this.data.list
    const conut = this.data.list.length

    for (let i = 0; i < conut; i++) {
      let copyContent = '姓名：' + list[i].registerInfo.realName + '\n'
        + '职务：' + list[i].registerInfo.position + '\n'
        + '电话：' + list[i].registerInfo.phone + '\n'
        + '单位：' + list[i].registerInfo.company + '\n'

      console.log(" list[i].custom = " + list[i].registerInfo.custom)
      if (list[i].registerInfo.custom == 1) {
        let temArr = this.data.customOptions[i]
        let length = temArr.length
        for (let j = 0; j < length; j++) {
          copyContent = copyContent + temArr[j].label + "：" + temArr[j].values + '\n'
        }
        // const rulesLength = list[i].registerInfo.rules.length
        // console.log(" rulesLength= " + rulesLength)
        // for (let j = 0; j < rulesLength; j++) {
        //   this.data.copyList = this.data.copyList + list[i].registerInfo.rules[j].label + "：" + list[i].registerInfo.rules[j].values + '\n'
        // }
      }
      this.data.copyList = this.data.copyList + '\n' + copyContent + '\n'
    }
    const data = this.data.copyListTitle + '\n' + this.data.copyList
    console.log("data is " + data)
    wx.setClipboardData({
      data: data,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功'
            })
          }
        })
      }
    })
  },
  downloadRefuserList: function (e) {
    wx.downloadFile({
      url: app.globalData.cheerFishHost + 'exportActivityExcel?activityId=' + this.options.id,
      header: {
        'appId': app.globalData.appId,
        'userIdentity': app.globalData.userInfo ? app.globalData.userInfo.identity : ''
      },
      success: function (res) {
        if (res.statusCode == 200) {
          var tempFilePath = res.tempFilePath;
          console.log("tempFilePath=" + tempFilePath)
        }
        wx.openDocument({
          filePath: res.tempFilePath,
          fileType: 'xls',
          success: function (res) {
            console.log('打开文档成功')
          },
          fail: function (res) {
            console.log(res);
          },
          complete: function (res) {
            console.log(res);
          }
        })
      },
      fail: function (res) {
        console.log('文件下载失败');
      },
      complete: function (res) { },
    })
  }
})