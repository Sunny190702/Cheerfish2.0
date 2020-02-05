const app = getApp()
var animation;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    course: {

    },
    currentTab: 0,
    showModal: false,
    regusers: [],
    regNum: '',
    loadingHidden: false,
    showOrderModal: false,
    //显示注册引导页
    showIntroduceInfo: true,
    //海报
    maskHidden: false,
    qrCodeTmpPath: '',
    animationData: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //显示注册引导页
    if (wx.getStorageSync("hasShowIntroduceInfo") === '1') {
      this.data.showIntroduceInfo = false
    }
    if (options.id) {
      this.setData({ id: options.id });
    } else {
      this.setData({ id: decodeURIComponent(options.scene) });
    }
    this.setData({
      courseId: this.data.id,
      pictureHost: app.globalData.pictureHost,
      systemInfo: app.globalData.systemInfo,
      showIntroduceInfo: this.data.showIntroduceInfo,
    })
  },
  fetchCoursrInfo: function () {
    const that = this;
    wx.request({
      url: app.globalData.cheerFishHost + 'api/courses/' + this.data.courseId,
      data: {},
      header: {
        'appId': app.globalData.appId,
        'userIdentity': app.globalData.userInfo ? app.globalData.userInfo.identity : ''
      },
      success: res => {
        console.log(res)
        setTimeout(function () {
          that.setData({
            loadingHidden: true
          });
        }, 500);
        if (res.statusCode === 200) {
          if (res.data.code === 10000) {
            const list = res.data.data
            this.setData({
              course: list
            })

            wx.downloadFile({
              url: that.data.pictureHost + list.picture,
              success(res) {
                if (res.statusCode === 200) {
                  that.setData({
                    bgPath: res.tempFilePath,
                  })
                }
              }
            })
            // start
            //游客注册完毕后反馈详情界面执行原操作
            //this.data.target === 1 表示从注册界面返回
            const userLevel = app.globalData.userInfo ? app.globalData.userInfo.accountLevel : 0
            if (this.data.target === 1 && userLevel > 0) {
              if (this.data.type === 'reports') {
                this.modal.clickMask()
              } else if (this.data.type === 'order') {
                if (list.isRegister == '1') {
                    wx.showToast({
                      title: '已报名',
                      icon: 'success',
                      duration: 2000
                    })
                  } else {
                    this.orderCourse()
                  }
              } else if (this.data.type === 'collect') {
                if (list.isFavorite == '1'){
                  wx.showToast({
                    title: '已收藏',
                    icon: 'success',
                    duration: 2000
                  })
                } else {
                  this.collectCourses()
                }
              }
            }
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000,
            })
          }
          // end
          // console.log('fetchCoursrInfo ' + JSON.stringify(list))
        } else {
          wx.showToast({
            title: '网络错误',
            icon: 'none',
            duration: 2000,
          })
        }
      },
      fail: res => {
        console.log('加载课程详情失败errorCode=' + res.data.code)
      }
    })
  },
  fetchReguserInfo: function () {
    wx.request({
      url: app.globalData.cheerFishHost + 'api/course-reg-users',
      data: {
        "courseId": this.data.courseId
      },
      header: {
        'appId': app.globalData.appId,
        'userIdentity': app.globalData.userInfo ? app.globalData.userInfo.identity : ''
      },
      success: res => {
        if (res.statusCode === 200) {
          if (res.data.code === 10000) {
            const list = res.data.data
            console.log('regusers list', list)
            this.setData({
              regusers: list.list.slice(0, 8),
              regNum: list.pageInfo
            })
          } else {
            console.log('加载报名表errorCode=' + res.data.code)
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
        console.log('加载报名表失败errorCode=' + res.data.code)
      }
    })
  },

  onReady: function(options) {
    this.modal = this.selectComponent("#modal");
    this.ordermodal = this.selectComponent("#ordermodal");
    this.reguser = this.selectComponent("#reguser");
    this.introduce = this.selectComponent("#introduce")
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function(options) {
    this.fetchCoursrInfo()
    this.fetchReguserInfo()
    // Sunny add for 详情小程序码 at 19-10-21
    // this.fetchAccesToken()
    this.getPageQrcode()
    // if (!app.globalData.logined) {
    //   app.globalData.logined = true
    //   wx.navigateTo({
    //     url: '/pages/guide/index',
    //   })
    // }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    clearTimeout()
  },
  reports: function(e) {
    const userLevel = app.globalData.userInfo ? app.globalData.userInfo.accountLevel : 0
    console.log("userLevel is " + userLevel)
    if (userLevel > 0) {
      this.modal.clickMask()
    } else {
      wx.navigateTo({
        url: "/pages/user/index?action=completeUserInfo&type=reports",
      })
    }
  },
  joinTap: function() {
    const userLevel = app.globalData.userInfo ? app.globalData.userInfo.accountLevel : 0
    console.log("userLevel is " + userLevel)
    if (userLevel > 0) {
      this.orderCourse()
    } else {
      
      wx.navigateTo({
        url: "/pages/user/index?action=completeUserInfo&type=order",
      })
    }
  },
  orderCourse: function() {
    const course = this.data.course
    // const courseId = course.id
    const that = this
    if (course.isRegister == '1') {
      wx.showToast({
        title: '您已报名过该课程,请在个人中查看',
        icon: 'none',
        duration: 2000
      })
    } else {
      this.ordermodal.clickMask()
    }
  },
  gohome: function(e) {
    wx.switchTab({
      url: '/pages/profile/profile'
    })
  },
  collect: function () {
    const userLevel = app.globalData.userInfo ? app.globalData.userInfo.accountLevel : 0
    console.log("userLevel is " + userLevel)
    if (userLevel > 0) {
      this.collectCourses()
    } else {
      wx.navigateTo({
        url: "/pages/user/index?action=completeUserInfo&type=collect",
      })
    }
  },
  collectCourses: function() {
    const course = this.data.course
    const that = this
    if (course.isFavorite == '1') {
      wx.request({
        url: app.globalData.cheerFishHost + 'api/course-favorites/' + that.data.courseId,
        data: { "courseId": that.data.courseId },
        header: {
          'appId': app.globalData.appId,
          'userIdentity': app.globalData.userInfo.identity
        },
        method: 'DELETE',
        success: res => {
          console.log('item favorities success ', res)
          if (res.statusCode === 200) {
            if (res.data.code === 10000) {
              wx.showToast({
                title: '取消收藏',
                icon: 'success',
                duration: 2000
              })
              that.setData({
                'course.isFavorite': '0'
              })
            } else {
              wx.showToast({
                title: '取消收藏失败',
                icon: 'success',
                duration: 2000
              })
            }
          } else {
            wx.showToast({
              title: '网络错误，请稍后再试',
              icon: 'none',
              duration: 2000,
            })
          }
        },
        fail: res => {
          console.log('item favorities false ', res)
        }
      })
    } else {
      console.log('继续收藏的逻辑')
      wx.request({
        url: app.globalData.cheerFishHost + 'api/course-favorites',
        data: {
          "courseId": that.data.courseId
        },
        header: {
          'appId': app.globalData.appId,
          'userIdentity': app.globalData.userInfo ? app.globalData.userInfo.identity : ''
        },
        method: 'POST',
        success: res => {
          console.log('course favorities success ', res)
          if (res.statusCode === 200) {
            if (res.data.code === 10000)  {
              wx.showToast({
                title: '收藏成功',
                icon: 'success',
                duration: 2000
              })
              this.setData({
                'course.isFavorite': '1'
              })
            } else {
              wx.showToast({
                title: '收藏失败',
                icon: 'success',
                duration: 2000
              })
            }
          } else {
            wx.showToast({
              title: '网络错误，请稍后再试',
              icon: 'none',
              duration: 2000,
            })
          }
        },
        fail: res => {
          console.log('course favorities false ', res)
        }
      })
    }
  },
  clickTab: function(e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
      })
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    if (this.animation) {
      this.hideMenuModal()
    }
    return {
      title: this.data.course.name,
    }
  },

  // 是否显示引导页
  showIntroduceInfo: function() {
    this.introduce.clickMask()
  },
  updateUI: function(e) {
    this.fetchReguserInfo()
    this.setData({
      'course.isRegister': '1',
    })
  },


  // Sunny add for 详情小程序码 at 19-10-21
  fetchAccesToken: function () {
    console.log("appid = " + app.globalData.appId)
    const that = this
    const appId = 'wx3fba7a4e4ff6e545'
    const secret = 'b4ca39dfa4fba9e69de1731447e9a1a0'
    let url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + appId + '&secret=' + secret
    wx.request({
      url: url,
      data: {},
      header: {},
      success: res => {
        if (res.statusCode === 200) {
          that.data.access_token = res.data.access_token
          that.data.expires_in = res.data.expires_in
          that.getPageQrcode()
        }
      },
      fail: res => {
        console.log('partner item flase')
      }
    })
  },
  // 生成页面的二维码
  getPageQrcode: function () {
    const that = this
    wx.request({
      url: app.globalData.cheerFishHost + 'api/w-xacode',
      data: {
        page: 'pages/home/course/course',
        scene: this.data.id
      },
      header: {
        'appId': app.globalData.appId,
        'userIdentity': app.globalData.userInfo ? app.globalData.userInfo.identity : ''
      },
      method: 'GET',
      success(res) {
        if (res.statusCode === 200) {
          if (res.data.code === 10000) {
            that.setData({
              src1: 'data:image/jpg;base64,' + res.data.data
            })
            var qrCode = wx.getFileSystemManager();
            var qrCodeData = 'data:image/png;base64,{{' + res.data.data + '}}'
            that.data.qrCodeTmpPath = wx.env.USER_DATA_PATH + '/test.png'
            qrCode.writeFile({
              filePath: that.data.qrCodeTmpPath,
              data: qrCodeData.slice(22),
              encoding: 'base64',
              success: res => {
                console.log(res)
              },
              fail: err => {
                console.log(err)
              }
            })
          }
        }
      },
      fail: res => {
        console.log('getPageQrcode fail ', res)
        wx.showToast({
          title: '服务器忙，请重试',
        })
      }
    })
  },

  previewImage: function (e) {
    var current = e.target.dataset.src;   //这里获取到的是一张本地的图片
    wx.previewImage({
      current: current,//需要预览的图片链接列表
      urls: [current] //当前显示图片的链接
    })

    this.setData({
      current: current,//需要预览的图片链接列表
      urls: [current] //当前显示图片的链接
    })
  },
  //海报 start
  //将canvas转换为图片保存到本地，然后将图片路径传给image图片的src
  createNewImg: function () {
    var text_x = 20
    var text_y = 20
    var step1 = 20
    var step2 = 30
    var canWidth = 400
    var canHeight = 550

    var that = this;
    var context = wx.createCanvasContext('mycanvas');
    context.setFillStyle("#fff")
    context.fillRect(0, 0, canWidth, canHeight)

    //投图
    var bgPath = that.data.bgPath ? that.data.bgPath : '/images/default/dpartner2.png'
    context.drawImage(bgPath, 10, 10, canWidth - 20, 200);
    text_y += text_y + 190 + step1

    //标题文字
    context.setFontSize(20);
    context.setFillStyle('#000');
    text_y = that.canvasMeasureText(context, that.data.course.name, text_x, text_y, step2)
    text_y += step2

    //学制
    context.setFontSize(14);
    var icon_w = 16
    if (that.data.course.educational && that.data.course.educational.length > 0) {
      context.drawImage('/images/menuicon/collegen.png', text_x, text_y - 14, icon_w, icon_w);
      context.fillText(that.data.course.educational, text_x + step1, text_y);
      text_y = text_y + step2
    }
    //学时
    if (that.data.course.duration && that.data.course.duration.length > 0) {
      context.drawImage('/images/menuicon/collegen.png', text_x, text_y - 14, icon_w, icon_w);
      context.fillText(that.data.course.duration, text_x + step1, text_y);
      text_y = text_y + step2
    }
    //上课地点
    if (that.data.course.address && that.data.course.address.length > 0) {
      context.drawImage('/images/icon/addr.png', text_x, text_y - 14, icon_w, icon_w);
      context.fillText(that.data.course.address, text_x + step1, text_y);
      text_y = text_y + step1
    }

    //绘制小程序二维码
    // text_y = text_y + step1
    var qr_w = 150
    var qrPath = that.data.qrCodeTmpPath;
    context.drawImage(qrPath, 120, text_y, qr_w, qr_w);
    context.setFillStyle('#333');
    text_y = text_y + qr_w + step2
    context.fillText('长按识别小程序二维码查看', 112, text_y);

    context.draw();
    //将生成好的图片保存到本地，需要延迟一会，绘制期间耗时

    setTimeout(function () {
      wx.canvasToTempFilePath({
        canvasId: 'mycanvas',
        success: function (res) {
          console.log("settimeout res is " + JSON.stringify(res))
          var tempFilePath = res.tempFilePath;
          that.setData({
            imagePath: tempFilePath,
            canvasHidden: true
          });
          console.log("imagePath is " + that.data.imagePath)
        },
        fail: function (res) {
          console.log(res);
        }
      });
    }, 200);
  },
  //点击保存到相册
  save: function () {
    var that = this
    wx.saveImageToPhotosAlbum({
      filePath: that.data.imagePath,
      success(res) {
        wx.showModal({
          content: '图片已保存到相册，赶紧晒一下吧~',
          showCancel: false,
          confirmText: '好的',
          confirmColor: '#333',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定');
              /* 该隐藏的隐藏 */
              that.setData({
                maskHidden: false
              })
            }
          }, fail: function (res) {
            console.log(11111)
          }
        })
      }, fail: function (err) {
        if (err.errMsg === "saveImageToPhotosAlbum:fail cancel"
          || err.errMsg === "saveImageToPhotosAlbum:fail authorize no response") {
          wx.showModal({
            title: '提示',
            content: '需要您授权保存相册',
            showCancel: false,
            success: modalSuccess => {
              wx.openSetting({
                success(settingdata) {
                  console.log("settingdata", settingdata)
                  if (settingdata.authSetting['scope.writePhotosAlbum']) {
                    wx.showModal({
                      title: '提示',
                      content: '获取权限成功,再次点击图片即可保存',
                      showCancel: false,
                    })
                  } else {
                    wx.showModal({
                      title: '提示',
                      content: '获取权限失败，将无法保存到相册哦~',
                      showCancel: false,
                    })
                  }
                },
                fail(failData) {
                  console.log("failData", failData)
                },
                complete(finishData) {
                  console.log("finishData", finishData)
                }
              })
            }
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
          })
        }
      }
    })
  },
  //点击生成
  formSubmitShareBill: function (e) {
    var that = this;
    animation.translate(0, 0).step();
    this.setData({
      maskHidden: false,
      animationData: animation.export()
    });
    wx.showToast({
      title: '海报生成中...',
      icon: 'loading',
      duration: 1000
    });
    setTimeout(function () {
      wx.hideToast()
      that.createNewImg();
      that.setData({
        maskHidden: true
      });
    }, 1000)
  },
  exit: function () {
    this.setData({
      maskHidden: false
    });
  },
//海报end

  showShareMenu: function () {
    animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })
    this.animation = animation
    animation.translate(0, -153).step();
    this.setData({
      animationData: animation.export()
    })
  },
  hideMenuModal: function () {
    animation.translate(0, 0).step();
    this.setData({
      animationData: animation.export()
    })
  },

  onNoticationServiceHandler: function() {
    console.log('可以使用一次性订阅')
    wx.requestSubscribeMessage({
      tmplIds: ['1bCbecbpD4gxQq5Jq2kSJA3xvL3Dye1VY-ooWH4k15o'
        , 'Ppnd1Gyg69g5HkfXYccetGnYvHGN2lg3J4fu1lwOy80'],
      success(res) {
        console.log('111')
        console.log(res)
      },
      fail(res) {
        console.log(res)
      }
    })
  },
  canvasMeasureText: function (context, str, text_x, text_y, step) {
    var canvasWidth = 360
    let lineWidth = 0;
    let lastSubStrIndex = 0;
    let rowCounts = 0
    let lineHeight = step
    let height = 800 - text_y - 200// 200 是二维码的显示区域高度， 800是画布高度
    let lines = height / step - 1
    let maxRowCounts = lines > 7 ? 7 : lines

    //每次开始截取的字符串的索引    
    for (let i = 0; i < str.length; i++) {
      lineWidth += context.measureText(str[i]).width;
      if (lineWidth > canvasWidth) {
        if (rowCounts > maxRowCounts) {
          context.fillText(str.substring(lastSubStrIndex, i - 1) + '...', text_x, text_y);
          break
        } else {
          context.fillText(str.substring(lastSubStrIndex, i), text_x, text_y);
          //绘制截取部分            
          text_y += lineHeight; //22为 文字大小20 + 2            
          lineWidth = 0;
          lastSubStrIndex = i;
          rowCounts++
        }
      }
      if (i == str.length - 1) {
        //绘制剩余部分            
        context.fillText(str.substring(lastSubStrIndex, i + 1), text_x, text_y);
      }
    }
    return text_y
  },
})