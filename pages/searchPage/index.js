const app = getApp()

Page({
  data: {
    sercherStorage: [],
    StorageFlag: false,
    noResult: false,
    history: true,
    title: 0,
    activities: [],
    activityPagenum: 1,
    activityTotalPageNums: 1,
    activityTotalRows: 1,
    courses: [],
    cooperation: [],
    cooperationPagenum: 1,
    cooperationTotalPageNums: 1,
    cooperationTotalRows: 1,
    list: [],
    seeker: [],
    seekerPagenum: 1,
    seekerTotalPageNums: 1,
    seekerTotalRows: 1,
    recruit: [],
    recruitPagenum: 1,
    recruitTotalPageNums: 1,
    recruitTotalRows: 1,
    content: '',
    coursePagenum: 1,
    courseTotalPageNums: 1,
    courseTotalRows: 1,
    collegeArray: [],
    collegePagenum: 1,
    collegeTotalPageNums: 1,
    collegeTotalRows: 1,
    showWrap: '',
    groupsPagenum: 1,
    groupsTotalPageNums: 1,
    groupsTotalRows: 1,    
    groups:[],
  },
  onLoad: function (options) {
    // Do some initialize when page load.
    console.log('options', this.options)
    wx.hideShareMenu()
    this.setData({
      // title: this.options.title,
      showWrap: this.options.page
    })
    if (this.data.showWrap == 'course') {
      this.setData({
        title: "请输入要查询的课程名称",
      })
    } else if (this.data.showWrap == 'activity') {
      this.setData({
        title: "请输入要查询的活动名称",
      })
    } else if (this.data.showWrap == 'recruits') {
      this.setData({
        title: "请输入要查询的职位/单位",
      })
    } else if (this.data.showWrap == 'seekers') {
      this.setData({
        title: "请输入要查询的求职信息",
      })
    } else if (this.data.showWrap == 'partner') {
      this.setData({
        title: "请输入要查询的合作主题/内容",
      })
    } else if (this.data.showWrap == 'college') {
      this.setData({
        title: "请输入要查询的学院名称",
      })
    }
    else if (this.data.showWrap == 'groups') {
      this.setData({
        title: "请输入要查询小圈的名称",
      })
    }
    this.openLocationsercher()
    // this.clearSearchStorage()
  },
  onReady: function () {
    // Do something when page ready.
    this.recruits = this.selectComponent("#recruits")
    this.partner = this.selectComponent("#partner")
    this.activity = this.selectComponent("#activity")
    this.course = this.selectComponent("#course")
    this.courses = this.selectComponent("#courses")
    this.college = this.selectComponent("#college")
    this.groups = this.selectComponent("#groups")
  },
  onShow: function () {
    // Do something when page show.
  },
  log1(e) {
    const value = e.detail.value
    this.setData({content: value})
  },
  searchPage() {
    this.setSearchData()
    if (this.data.showWrap == 'course') {
      this.getCourses(1)
    } else if (this.data.showWrap == 'activity') {
      this.getActivity(1)
    } else if (this.data.showWrap == 'recruits' || this.data.showWrap == 'seekers') {
      this.getJob(1)
    } else if (this.data.showWrap == 'partner') {
      this.getPartner(1)
    } else if (this.data.showWrap == 'college') {
      this.getCollege(1)
    } else if (this.data.showWrap == 'groups') {
      this.getGroups(1)
    }
  },
  //清除缓存历史
  clearSearchStorage: function () {
    wx.removeStorageSync('searchData')
    this.setData({
      sercherStorage: [],
      StorageFlag: false,
    })
  },
  //打开历史记录
  openLocationsercher: function () {
    this.setData({
      sercherStorage: wx.getStorageSync('searchData') || [],
      StorageFlag: true,
      listFlag: true,
    })
  },
  setSearchData() {
    var self = this
    if (self.data.content != '') {
      var searchData = self.data.sercherStorage
      searchData.push({
        id: searchData.length,
        name: self.data.content
      })
      wx.setStorageSync('searchData', searchData)
      self.setData({ StorageFlag: false, })
    }
  },
  getCollege(pageNum) {
    pageNum = pageNum
    const that = this
    const header = {
      'appId': app.globalData.appId,
      'userIdentity': app.globalData.userInfo ? app.globalData.userInfo.identity : ''
    }
    const content = that.data.content
    const apiUrl = app.globalData.cheerFishHost + 'api/schools'
    const Data = {
      'pageNum': pageNum,
      'searchName': content
    }
    wx.request({
      url: apiUrl,
      data: Data,
      header: header,
      success: res => {
        if (res.statusCode === 200) {
          if (res.data.code === 10000) {
            that.setData({noResult: false})
            console.log('res', res)
            let tmpArr = that.data.collegeArray;
            tmpArr.push.apply(tmpArr, res.data.data.list)
            const collegePagenum = that.data.collegePagenum + 1
            const collegeTotalPageNums = res.data.data.pageInfo.totalPageNums
            const collegeTotalRows = res.data.data.pageInfo.totalRows
            const tmpArr1 = res.data.data.list
            const Arr = pageNum == 1 ? tmpArr1 : tmpArr
            that.setData({
              collegeArray: Arr,
              collegePagenum,
              collegeTotalPageNums,
              collegeTotalRows,
              history: false
            })
          } else {
            that.setData({
              noResult: true,
              history: false})
            console.log('schools 加载失败' + res.data.msg)
          }
        } 
      },
      fail: res => {
        console.log('schools 加载失败' + res.errMsg)
      }
    })
  },
  getJob(pageNum) {
    pageNum = pageNum
    const that = this;
    const header =  {
      'appId': app.globalData.appId,
      'userIdentity': app.globalData.userInfo ? app.globalData.userInfo.identity : ''
    }
    const content = that.data.content
    const apiUrl = that.data.showWrap == 'recruits' ? app.globalData.cheerFishHost + 'api/recruits' : app.globalData.cheerFishHost + 'api/seekers'
    const Data = {
      'pageNum': pageNum,
      'searchName': content
    }
    wx.request({
      url: apiUrl,
      data: Data,
      header: header,
      success: res => {
        if (res.statusCode === 200) {
          if (res.data.code === 10000) {
            that.setData({noResult: false})
            console.log('res', res)
            let tmpArr = that.showWrap == 'recruits' ? that.data.recruit : that.data.seeker
            tmpArr.push.apply(tmpArr, res.data.data.list)
            const Pagenum = that.data.cooperationPagenum + 1
            const TotalPageNums = res.data.data.pageInfo.totalPageNums
            const TotalRows = res.data.data.pageInfo.totalRows
            const tmpArr1 = res.data.data.list
            const Arr = pageNum == 1 ? tmpArr1 : tmpArr
            
            let newArr = this.resetTime(Arr)
            if (that.data.showWrap == 'recruits') {
              that.setData({
                recruit: newArr,//Arr,
                recruitPagenum: Pagenum,
                recruitTotalPageNums: TotalPageNums,
                recruitTotalRows: TotalRows,
                history: false
              })
            } else {
              that.setData({
                seeker: newArr,//Arr,
                seekerPagenum: Pagenum,
                seekerTotalPageNums: TotalPageNums,
                seekerTotalRows: TotalRows,
                history: false
              })
            }
          } else {
            that.setData({
              noResult: true,
              history: false})
            console.log('recruits 加载失败msg ' + res.data.msg)
          }
        } 
      },
      fail: res => {
        console.log('recruits 加载失败errMsg ' + res.errMsg)
      }
    })
  },
  getPartner(pageNum) {
    pageNum = pageNum
    console.log('getMore pagenum', pageNum)
    const that = this;
    const header =  {
      'appId': app.globalData.appId,
      'userIdentity': app.globalData.userInfo ? app.globalData.userInfo.identity : ''
    }
    const content = that.data.content
    const apiUrl = app.globalData.cheerFishHost + 'api/cooperations'
    const Data = {
      'pageNum': pageNum,
      'searchName': content
    }
    wx.request({
      url: apiUrl,
      data: Data,
      header: header,
      success: res => {
        if (res.statusCode === 200) {
          if (res.data.code === 10000) {
            that.setData({noResult: false})
            console.log('res', res)
            let tmpArr = that.data.cooperation;
            tmpArr.push.apply(tmpArr, res.data.data.list)
            const cooperationPagenum = that.data.cooperationPagenum + 1
            const cooperationTotalPageNums = res.data.data.pageInfo.totalPageNums
            const cooperationTotalRows = res.data.data.pageInfo.totalRows
            const tmpArr1 = res.data.data.list
            const Arr = pageNum == 1 ? tmpArr1 : tmpArr

            let newArr = this.resetTime(Arr)
            that.setData({
              cooperation: newArr,//Arr,
              cooperationPagenum,
              cooperationTotalPageNums,
              cooperationTotalRows,
              history: false
            })
          } else {
            that.setData({
              noResult: true,
              history: false})
            console.log('cooperations 加载失败' + res.data.msg)
          }
        } 
      },
      fail: res => {
        console.log('cooperations 加载失败' + res.errMsg)
      }
    })
  },
  getActivity(pageNum) {
    pageNum = pageNum
    console.log('getMore pagenum', pageNum)
    const that = this;
    const header =  {
      'appId': app.globalData.appId,
      'userIdentity': app.globalData.userInfo ? app.globalData.userInfo.identity : ''
    }
    const content = that.data.content
    const apiUrl = app.globalData.cheerFishHost + 'api/activities'
    const Data = {
      'pageNum': pageNum,
      'searchName': content
    }
    wx.request({
      url: apiUrl,
      data: Data,
      header: header,
      success: res => {
        if (res.statusCode === 200) {
          if (res.data.code === 10000) {
            that.setData({noResult: false})
            console.log('res', res)
            let tmpArr = that.data.activities;
            tmpArr.push.apply(tmpArr, res.data.data.list)
            const activityPagenum = that.data.activityPagenum + 1
            const activityTotalPageNums = res.data.data.pageInfo.totalPageNums
            const activityTotalRows = res.data.data.pageInfo.totalRows
            const tmpArr1 = res.data.data.list
            const Arr = pageNum == 1 ? tmpArr1 : tmpArr

            let newArr = that.resetStart(Arr)
            console.log("newArr " + JSON.stringify(newArr))
            that.setData({
              activities: Arr,
              activityPagenum,
              activityTotalPageNums,
              activityTotalRows,
              history: false
            })
          } else {
            that.setData({
              noResult: true,
              history: false})
            console.log('activities 加载失败' + res.data.msg)
          }
        } 
      },
      fail: res => {
        console.log('activities 加载失败' + res.errMsg)
      }
    })
  },
  getCourses(pageNum) {
    pageNum = pageNum
    console.log('getMore pagenum', pageNum)
    const that = this;
    const header =  {
      'appId': app.globalData.appId,
      'userIdentity': app.globalData.userInfo ? app.globalData.userInfo.identity : ''
    }
    const content = that.data.content
    const apiUrl = app.globalData.cheerFishHost + 'api/courses'
    const Data = {
      'pageNum': pageNum,
      'searchName': content
    }
    wx.request({
      url: apiUrl,
      data: Data,
      header: header,
      success: res => {
        if (res.statusCode === 200) {
          if (res.data.code === 10000) {
            that.setData({noResult: false})
            console.log('res', res)
            let tmpArr = that.data.courses;
            tmpArr.push.apply(tmpArr, res.data.data.list)
            const coursePagenum = that.data.coursePagenum + 1
            const courseTotalPageNums = res.data.data.pageInfo.totalPageNums
            const courseTotalRows = res.data.data.pageInfo.totalRows
            const tmpArr1 = res.data.data.list
            const Arr = pageNum == 1 ? tmpArr1 : tmpArr
            that.setData({
              courses: Arr,
              coursePagenum,
              courseTotalPageNums,
              courseTotalRows,
              history: false
            })
          } else {
            that.setData({
              noResult: true,
              history: false})
            console.log('courses 加载失败' + res.data.msg)
          }
        }
      },
      fail: res => {
        console.log('courses 加载失败' + res.errMsg)
      }
    })
  },
  onHide: function () {
    // Do something when page hide.
  },
  onUnload: function () {
    // Do something when page close.
  },
  onPullDownRefresh: function () {
    // Do something when pull down.
  },
  onReachBottom: function () {
    // Do something when page reach bottom.
  },
  onShareAppMessage: function () {
    // return custom share data when user share.
  },
  onPageScroll: function () {
    // Do something when page scroll
  },
  onResize: function () {
    // Do something when page resize
  },
  resetTime: function (dataArr) {
    for (var j = 0; j < dataArr.length; j++) {
      dataArr[j].updatedAt = dataArr[j].updatedAt.replace('T', ' ')
    }
    return dataArr;
  },
  resetStart: function (dataArr) {
    for (var j = 0; j < dataArr.length; j++) {
      dataArr[j].start = dataArr[j].start.substring(0, 10)
    }
    return dataArr;
  },
  getGroups: function (pageNum){
    pageNum = pageNum
    console.log('getMore pagenum', pageNum)
    const that = this;
    const header = {
      'appId': app.globalData.appId,
      'userIdentity': app.globalData.userInfo ? app.globalData.userInfo.identity : ''
    }
    const content = that.data.content
    const apiUrl = app.globalData.cheerFishHost + 'api/groups'
    const Data = {
      'pageNum': pageNum,
      'searchName': content
    }
    wx.request({
      url: apiUrl,
      data: Data,
      header: header,
      success: res => {
        if (res.statusCode === 200) {
          if (res.data.code === 10000) {
            that.setData({ noResult: false })
            console.log('res', res)
            let tmpArr = that.data.groups;
            tmpArr.push.apply(tmpArr, res.data.data.list)
            const groupsPagenum = that.data.groupsPagenum + 1
            const groupsTotalPageNums = res.data.data.pageInfo.totalPageNums
            const groupsTotalRows = res.data.data.pageInfo.totalRows
            const tmpArr1 = res.data.data.list
            const Arr = pageNum == 1 ? tmpArr1 : tmpArr
            console.log('Arr', Arr)
            console.log('groupsTotalPageNums = ', groupsTotalPageNums)
            console.log('groupsTotalRows = ', groupsTotalRows)
            console.log('groupsPagenum = ', groupsPagenum)
            that.setData({
              groups: Arr,
              groupsPagenum,
              groupsTotalPageNums,
              groupsTotalRows,
              history: false
            })
          } else {
            that.setData({
              noResult: true,
              history: false
            })
            console.log('groups 加载失败' + res.data.msg)
          }
        }
      },
      fail: res => {
        console.log('groups 加载失败' + res.errMsg)
      }
    })
  },
})