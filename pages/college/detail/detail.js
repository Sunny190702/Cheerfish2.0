// pages/college/detail/detail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    circleDisplay: true,
    articleOpen: true,
    coursesList: [],
    college: {},
    isOverflow: true,
    loadingHidden: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('this', this.options)
    this.setData({
      pictureHost: app.globalData.pictureHost
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (options) {
    const collegeId = this.options.id
    const url = app.globalData.cheerFishHost + 'api/schools/' + collegeId
    wx.request({
      url: url,
      data: {},
      header: {
        'appId': app.globalData.appId,
        'userIdentity': app.globalData.userInfo ? app.globalData.userInfo.identity : ''
      },
      success: res => {
        this.setData({
          college: res.data.data
        })

        const courseUrl = app.globalData.cheerFishHost + 'api/courses'
        const that = this
        wx.request({
          url: courseUrl,
          data: { schoolId: collegeId },
          header: {
            'appId': app.globalData.appId,
            'userIdentity': app.globalData.userInfo ? app.globalData.userInfo.identity : ''
          },
          
          success: res => {
            setTimeout(function () {
              that.setData({
                loadingHidden: true
              });
            }, 500);
            if (res.statusCode === 200) {
              console.log(JSON.stringify(res.data))
              if (res.data.code === 10000) {
                const courses = res.data.data.list
                this.setData({
                  coursesList: courses
                })
              } else {
                console.log('college course false')
              }

            } else {
              console.log('college course false')
            }
            
          },
          fail: res => {
            console.log('college course false')
          }
        })
      },
      fail: res => {
        this.setData({
          collegeList: {
            picture: "/images/default/dpartner2.png",
            owner: "清华大学",
            badge: "/images/default/dpartner2.png",
            name: "五道口金融学院",
            introduction: "北京鹏昇国际在前国际商务资深律师、中欧旅游业资深从业人士、 欧洲房地产资深从业人员、前中资企业海外分公司CFO等不同行业背景人士的共同筹划下创立而成，强势资源目的地国家为希腊、保加利亚及其他巴尔干国家。主要为有意出海欧洲的中小企业，提供国际商务服务及咨询服务。"
          }
        })
      }
    })
    // const collegeId = this.data.id;
    console.log('collegeId', collegeId)


  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  showMoreDesc: function () {
    this.setData({
      isOverflow: !this.data.isOverflow
    })
  },
  goToCoursePage: function (e) {
    const that = this
    const id = e.currentTarget.id
    let item = this.data.coursesList
    function pFn(p) { return p.id == id }
    const index = item.findIndex(pFn)
    console.log('index is ', index)
    if (index >= 0) {
      item[index].hot = item[index].hot + 1
    }
    wx.navigateTo({
      url: "/pages/home/course/course?id=" + id
    })
    setTimeout(() => {
      that.setData({ coursesList: item })
    }, 1000);
  },
  gohome: function (e) {
    wx.switchTab({
      url: '/pages/profile/profile'
    })
  },
  joinTap: function (e) {
    // if (!app.globalData.userInfo) {
    //   this.toast.show("请先在我的中加入名校精英后可预约咨询课程")
    //   return
    // }
    
    const userLevel = app.globalData.userInfo ? app.globalData.userInfo.accountLevel : 0
    if (userLevel < 1) {
      wx.navigateTo({
        url: "/pages/user/index?action=completeUserInfo"
      })
      return 
    } 

    const that = this
    const id = e.currentTarget.id
    let item = this.data.coursesList

    function pFn(p) {
      return p.id == id
    }
    const index = item.findIndex(pFn)
    const course = item[index]

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
              url: app.globalData.cheerFishHost +'api/course-registers',
              data: { "courseId": id, "isRegister": 1,},
              header: {
                'appId': app.globalData.appId,
                'userIdentity': app.globalData.userInfo ? app.globalData.userInfo.identity : ''
              },
              method: 'POST',
              success: res => {
                if (res.statusCode === 200) {
                  if (res.data.code === 10000) {
                    let obj = item
                    obj[index].isRegister = '1'
                    that.setData({
                      coursesList: item
                    })

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
                //   'courseItem.isRegister': '1'
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
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  click: function (params) {
    // document.getElementById('circle').style.display = 'none'
    this.setData({
      circleDisplay: false
    })
    this.setData({
      articleOpen: false
    })
    // document.getElementById('article').classList.add('open')
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (ops) {
    console.log()
    if (ops.from === 'button') {
      // 主办方页面内转发按钮
      console.log(ops.target)
    }
  }
})