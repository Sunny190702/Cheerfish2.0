// pages/homepage/home.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    pageNum: 1,
    pageNums: 1,
    loadingHidden: false,
    isOverflow: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      groupId: this.options.id,
      pictureHost: app.globalData.pictureHost,
      userLevelInfo: app.globalData.userInfo ? app.globalData.userInfo.accountLevel : '',
    })
  },

  fetchList: function (pageNum) {
    pageNum = pageNum ? pageNum : 2;
    const that = this;
    const apiUrl = app.globalData.cheerFishHost + 'api/flow-infos'
    wx.request({
      url: apiUrl,
      data: { 
        "pageNum": pageNum,
        "groupId": that.data.groupId
      },
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
          if (res.data.code === 10000) {
            let tmpArr = that.data.list;
            tmpArr.push.apply(tmpArr, res.data.data.list)
            console.log(tmpArr)
            const pagenum = that.data.pageNum + 1
            const rows = res.data.data.pageInfo.totalPageNums
            let newArr = that.resetTime(tmpArr)
            that.setData({
              list: newArr,
              pageNum: pagenum,
              pageNums: rows,
            })
          } else {
            console.log("活动列表加载失败 ", res.data.msg)
          }
        }
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
      },
      fail: res => {
        console.log("活动列表加载失败 ", res.errMsg)
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
      }
    })
  },
  resetTime: function (dataArr) {
    for (var j = 0; j < dataArr.length; j++) {
      dataArr[j].updatedAt = dataArr[j].updatedAt.replace('T', ' ')
    }
    return dataArr;
  },
  goToDetailPage: function (e) {
    const id = e.currentTarget.id
    console.log("gotoDetail e is "+ JSON.stringify(e))
    let item = this.data.list
    let obj = item
    obj[id].hot = obj[id].hot + 1

    const infoId = e.currentTarget.dataset.id
    const type = e.currentTarget.dataset.type
    if (type == 1) {
      wx.navigateTo({
        url: "/pages/activity/detail/detail?id=" + infoId
      })
    } else if (type == 2) {
      wx.navigateTo({
        url: "/pages/job/detail/detail?id=" + infoId + '&type=recruits'
      })
    } else if (type == 3) {
      wx.navigateTo({
        url: "/pages/job/detail/detail?id=" + infoId + '&type=seekers'
      })
    } else if (type == 4) {
      wx.navigateTo({
        url: "/pages/partner/detail/detail?id=" + infoId
      })
    } else if (type == 5) {
      wx.navigateTo({
        url: "/pages/home/course/course?id=" + infoId
      })
    } else {
      console.log("goToDetailPage failed , type is " + type)
    }

    const that = this
    setTimeout(() => {
      that.setData({
        list: obj
      })
    }, 300);
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // this.fetchGroupInfo()
    this.fetchList(1)
  },
  fetchGroupInfo: function(){
    const that = this
    const url = app.globalData.cheerFishHost + 'api/groups/' + this.data.groupId
    wx.request({
      url: url,
      data: {},
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
        console.log(res)
        if (res.statusCode === 200) {
          if (res.data.code === 10000) {
            if (that.data.type === 'order') {
              if (that.data.follow) {
                wx.showToast({
                  title: '已加入',
                  icon: 'success',
                  duration: 2000
                })
              } else {
                that.bindJoinGroup()
              }
            } else if (that.data.type === 'collect') {
              if (that.data.follow) {
                wx.showToast({
                  title: '已关注',
                  icon: 'success',
                  duration: 2000
                })
              } else {
                that.bindFollowGroup()
              }
              
            } 

            let data = res.data.data
            if (data.members > 999) {
              data.members = '999+'
            }
            that.setData({
              members: data.members,
              introduced: data.introduced,
              name: data.name,
              thumbnail: data.thumbnail,
              master: data.master,
              follow: data.follow,
              member: data.member,
              fans: data.fans,
            })
          } else {
            wx.showToast({
              title: '信息获取失败，下拉刷新',
              icon: 'success',
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
 
      }
    })

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.fetchGroupInfo()
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
    wx.showNavigationBarLoading()
    this.initData()
    this.fetchGroupInfo()
    this.fetchList(1)
  },
  initData: function () {
    this.setData({
      list: [],
    })
    this.data.pageNum2 = 1
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.bottom()
  },
  bottom(e) {
    const num = this.data.pageNum
    const nums = this.data.pageNums
    if (nums >= num) {
      this.fetchList(num)
    } else {
      if (e == 1) {
      } else {
        wx.showToast({
          title: '没有更多了!!!',
          icon: 'none',
          duration: 2500
        })
      }
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var name = app.globalData.userInfo ? app.globalData.userInfo.userBaseInfo.name : '精英社'
    return {
      title: name + "邀请您关注/加入" + this.data.name,
    }
  },
  showMoreDesc: function () {
    this.setData({
      isOverflow: !this.data.isOverflow
    })
  },
  goToMemberList: function(e){
    // this.data.master || this.data.member
    // 管理员和成员可以查看成员列表
    if (this.data.master || this.data.member) {
      console.log("this.data.master = "+ this.data.master)
      wx.navigateTo({
        url: './members?id=' + this.data.groupId + "&master=" + this.data.master,
      })
    }
  },
  bindFollowGroup: function () {
    // this.cancelJoinGroup()
    const userLevel = app.globalData.userInfo ? app.globalData.userInfo.accountLevel : 0
    if (userLevel > 0) {
      if (this.data.follow) {
        this.cancelFollowGroup()
      }
      else {
        this.followGroup()
      }
    } else {
      wx.navigateTo({
        url: "/pages/user/index?action=completeUserInfo&type=collect"
      })
    }
    
  },
  followGroup: function () {
    const that = this
    wx.request({
      url: app.globalData.cheerFishHost + 'api/group-follow',
      data: { "groupId": this.data.groupId },
      header: {
        'appId': app.globalData.appId,
        'userIdentity': app.globalData.userInfo ? app.globalData.userInfo.identity : ''
      },
      method: 'POST',
      success: res => {
        console.log('item join success ', res)
        if (res.statusCode === 200) {
          if (res.data.code === 10000) {
            that.setData({
              follow: true
            })
            wx.showToast({
              title: '关注成功',
              icon: 'success',
              duration: 2000
            })
          } else {
            wx.showToast({
              title: '关注失败',
              icon: 'success',
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
        console.log('item follow group false ', res)
      }
    })
  },
  cancelFollowGroup: function () {
    const that = this
    wx.request({
      url: app.globalData.cheerFishHost + 'api/group-follow/' + this.data.groupId,
      data: {},
      header: {
        'appId': app.globalData.appId,
        'userIdentity': app.globalData.userInfo ? app.globalData.userInfo.identity : ''
      },
      method: 'DELETE',
      success: res => {
        console.log('cancel join success ', res)
        if (res.statusCode === 200) {
          if (res.data.code === 10000) {
            that.setData({
              follow: false
            })
            wx.showToast({
              title: '取消关注成功',
              icon: 'success',
              duration: 2000
            })
          } else {
            wx.showToast({
              title: '关注失败',
              icon: 'success',
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
        console.log('item follow group false ', res)
      }
    })
  },
  bindJoinGroup: function () {
    // this.cancelJoinGroup()
    const userLevel = app.globalData.userInfo ? app.globalData.userInfo.accountLevel : 0
    if (userLevel > 0) {
      this.joinGroup()
      // wx.navigateTo({
      //   url: "/pages/homepage/apply?id=" + this.data.groupId
      // })
    } else {
      wx.navigateTo({
        url: "/pages/user/index?action=completeUserInfo&type=order"
      })
    }
  },
  joinGroup: function () {
    const that = this
    wx.request({
      url: app.globalData.cheerFishHost + 'api/group-join',
      data: { "groupId": this.data.groupId },
      header: {
        'appId': app.globalData.appId,
        'userIdentity': app.globalData.userInfo ? app.globalData.userInfo.identity : ''
      },
      method: 'POST',
      success: res => {
        console.log('item join success ', res)
        if (res.statusCode === 200) {
          if (res.data.code === 10000) {
            wx.showToast({
              title: '加入成功',
              icon: 'success',
              duration: 2000
            })
            // 加入成功，自动关注
            that.followGroup()
          } else {
            wx.showToast({
              title: '加入失败',
              icon: 'success',
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
        console.log('item join group false ', res)
      }
    })
  },
  cancelJoinGroup: function () {
    const that = this
    wx.request({
      url: app.globalData.cheerFishHost + 'api/group-join/' + this.data.groupId,
      data: {},
      header: {
        'appId': app.globalData.appId,
        'userIdentity': app.globalData.userInfo ? app.globalData.userInfo.identity : ''
      },
      method: 'DELETE',
      success: res => {
        console.log('cancel join success ', res)
        if (res.statusCode === 200) {
          if (res.data.code === 10000) {
            wx.showToast({
              title: '取消关注成功',
              icon: 'success',
              duration: 2000
            })
          } else {
            wx.showToast({
              title: '关注失败',
              icon: 'success',
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
        console.log('item join group false ', res)
      }
    })
  },
  gohome: function () {
    wx.switchTab({
      url: '/pages/homepage/index'
    })
  },
  bindSetting: function(){
    wx.navigateTo({
      // url: './audits?id=' + this.data.groupId,
      url: './setting?id=' + this.data.groupId + "&master=" + this.data.master +
        "&member=" + this.data.member,
    })
  },
  goToNewPage: function (e) {
    const userLevel = app.globalData.userInfo ? app.globalData.userInfo.accountLevel : 0
    if (userLevel > 0) {
      if (this.data.member) {
        wx.navigateTo({
          url: "/pages/homepage/newMessageType?id=" + this.data.groupId
        })
      } else {
        wx.showToast({
          title: '加入后可发布信息',
          icon: 'success',
          duration: 2000
        })
      }
    } else {
      wx.navigateTo({
        url: "/pages/user/index?action=completeUserInfo&type=new"
      })
    }
  },
  bindExit: function () {
    const that = this
    wx.request({
      url: app.globalData.cheerFishHost + 'api/group-members/' + this.data.groupId,
      data: {},
      header: {
        'appId': app.globalData.appId,
        'userIdentity': app.globalData.userInfo ? app.globalData.userInfo.identity : ''
      },
      method: 'DELETE',
      success: res => {
        if (res.statusCode === 200) {
          if (res.data.code === 0) {
            wx.showToast({
              title: '退出成功',
              icon: 'success',
              duration: 2000
            })
          } else {
            wx.showToast({
              title: '退出失败',
              icon: 'success',
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
        console.log('item exit group false ', res)
      }
    })
  },
})