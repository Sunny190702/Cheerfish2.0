const app = getApp()
var animation;
Page({
  data: {
    list: {},
    showModal: false,
    regusers: [],
    regNum: '',
    start: '',
    end: '',
    loadingHidden: false,
    customlist:[],
    customliststring: [],
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
  onLoad: function (options) {
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
      activityId: this.data.id,
      pictureHost: app.globalData.pictureHost,
      systemInfo: app.globalData.systemInfo,
      showIntroduceInfo: this.data.showIntroduceInfo,
    })
    console.log("userInfo " + JSON.stringify(app.globalData.userInfo))
  },
  fetchActivityInfo: function () {
    const that = this
    const url = app.globalData.cheerFishHost + 'api/activities/' + this.data.activityId
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
        }, 500);
        if (res.statusCode === 200) {
          if (res.data.code === 10000) {
            const reslist = res.data.data
            console.log('activity item ', reslist)
            
            const starttime = reslist.start.replace('T', ' ')
            const endtime = reslist.end.replace('T', ' ')
            const deadLinetime = reslist.deadLine.replace('T', ' ')
            this.setData({
              list: reslist,
              start: starttime.substring(0, 16),
              end: endtime.substring(0, 16),
              deadLine: deadLinetime.substring(0, 16),
              // createdAt: reslist.createdAt.replace('T', ' '),
              updatedAt: reslist.updatedAt.replace('T', ' '),
              // customlist: reslist.rules ? JSON.parse(reslist.rules) : '',
              // customliststring: reslist.rules ? JSON.parse(reslist.rules) : '',
            })

            console.log("url1 is " + that.data.pictureHost + reslist.pic)
            wx.downloadFile({
              url: that.data.pictureHost + reslist.pic,
              success(res) {
                if (res.statusCode === 200) {
                  that.setData({
                    bgPath: res.tempFilePath,
                  })
                }
              }
            })

            wx.downloadFile({
              url: that.data.pictureHost + reslist.publisherInfo.header,
              success(res) {
                if (res.statusCode === 200) {
                  that.setData({
                    headerPath: res.tempFilePath,
                  })
                }
              }
            })
            // for (let i = 0; i < this.data.customlist.length; i++) {
            //   if (this.data.customlist[i].type == 'radio' 
            //       || this.data.customlist[i].type == 'checkbox') {
            //     let options = Object.keys(this.data.customlist[i].options).map(key => ({
            //       name: key,
            //     }))
            //     this.data.customlist[i].options = options
            //   }
            // }

            // start
            //游客注册完毕后反馈详情界面执行原操作
            //this.data.target === 1 表示从注册界面返回
            const userLevel = app.globalData.userInfo ? app.globalData.userInfo.accountLevel : 0
            if (this.data.target === 1 && userLevel > 0) {
              this.data.target = 0
              if (this.data.type === 'reports') {
                this.modal.clickMask()
              } else if (this.data.type === 'order') {
                if (reslist.isRegister == '1') {
                  wx.showToast({
                    title: '已报名',
                    icon: 'success',
                    duration: 2000
                  })
                } else {
                  this.orderActivity()
                }
              } else if (this.data.type === 'collect') {
                if (reslist.isFavorite == '1') {
                  wx.showToast({
                    title: '已收藏',
                    icon: 'success',
                    duration: 2000
                  })
                } else {
                  this.collectActivity()
                }
              }
            }
            //end
          } else {
            console.log('code !==10000', res)
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
          }
        }
      },
      fail: res => {
        console.log('activity item flase')
        wx.showToast({
          title: res.errMsg,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  fetchRegusersList: function () {
    wx.request({
      url: app.globalData.cheerFishHost + 'api/activity-reg-users',
      data: { "activityId": this.data.activityId },
      header: {
        'appId': app.globalData.appId,
        'userIdentity': app.globalData.userInfo ? app.globalData.userInfo.identity : ''
      },
      success: res => {
        console.log('regusers list res is ', res)
        if (res.statusCode === 200) {
          if (res.data.code === 10000) {
            const list = res.data.data
            console.log('regusers list', list)
            this.setData({
              regusers: list.list.slice(0, 8),
              regNum: list.pageInfo
            })
          } else {
            // 报名人数为0
            // console.log('res is ', res)
            // wx.showToast({
            //   title: res.data.msg,
            //   icon: 'none',
            //   duration: 2000
            // })
          }
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
  fetchBannerImage: function () {
    const header = {
      'appId': app.globalData.appId,
      'userIdentity': app.globalData.userInfo ? app.globalData.userInfo.identity : ''
    }

    wx.request({
      url: app.globalData.cheerFishHost + 'api/info-backgrounds',
      data: {
        type: 5
      },
      header: header,
      method: 'GET',
      success: res => {
        if (res.statusCode === 200) {
          if (res.data.code === 10000) {
            this.setData({
              banner: res.data.data.background,
            })
          }
        }
      }
    })
  },
  onReady: function () {
    this.modal = this.selectComponent("#modal");
    this.reguser = this.selectComponent("#reguser");
    this.joinmodal = this.selectComponent("#joinmodal");
    this.introduce = this.selectComponent("#introduce")
  },

  joinTap: function (e) {
    const userLevel = app.globalData.userInfo ? app.globalData.userInfo.accountLevel : 0
    console.log("userLevel is " + userLevel)
    if (userLevel > 0) {
      this.orderActivity()
    } else {
      wx.navigateTo({
        url: "/pages/user/index?action=completeUserInfo&type=order"
      })
    }
  },

  orderActivity: function () {
    const that = this
    const item = that.data.list
    console.log('item', item)
    if (item.isRegister == '1') {
      wx.showToast({
        title: '您已报名过该活动,请在个人中查看',
        icon: 'none',
        duration: 2000
      })
    } else {
      // console.log("orderActivity=====", this.data.customlist)
      // this.joinmodal.clickMask(this.data.customlist, this.data.customliststring)
      wx.navigateTo({
        url: "/pages/activity/join/join?id=" + this.data.activityId
      })
    }
  },
  reports: function (e) {
    const userLevel = app.globalData.userInfo ? app.globalData.userInfo.accountLevel : 0
    console.log("userLevel is " + userLevel)
    if (userLevel > 0) {
      this.modal.clickMask()
    } else {
      wx.navigateTo({
        url: "/pages/user/index?action=completeUserInfo&type=reports"
      })
    }
  },
  collect: function (e) {
    const userLevel = app.globalData.userInfo ? app.globalData.userInfo.accountLevel : 0
    console.log("userLevel is " + userLevel)
    if (userLevel > 0) {
      this.collectActivity()
    } else {
      wx.navigateTo({
        url: "/pages/user/index?action=completeUserInfo&type=collect"
      })
    }
  },
  collectActivity: function () {
    const that = this
    const item = that.data.list
    if (item.isFavorite == '1') {
      wx.request({
        url: app.globalData.cheerFishHost + 'api/activity-favorites/' + item.id,
        data: { "activityId": item.id },
        header: {
          'appId': app.globalData.appId,
          'userIdentity': app.globalData.userInfo ? app.globalData.userInfo.identity : ''
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
                'list.isFavorite': '0'
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
              title: '取消收藏失败',
              icon: 'success',
              duration: 2000
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
        url: app.globalData.cheerFishHost +  'api/activity-favorites',
        data: { "activityId": item.id },
        header: {
          'appId': app.globalData.appId,
          'userIdentity': app.globalData.userInfo ? app.globalData.userInfo.identity : ''
        },
        method: 'POST',
        success: res => {
          console.log('item favorities success ', res)
          if (res.statusCode === 200) {
            if (res.data.code === 10000)  {
              wx.showToast({
                title: '收藏成功',
                icon: 'success',
                duration: 2000
              })
              that.setData({
                'list.isFavorite': '1'
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
              title: '网络错误',
              icon: 'none',
              duration: 2000,
            })
          }
        },
        fail: res => {
          console.log('item favorities false ', res)
        }
      })
    }
  },
  gohome: function (e) {
    wx.switchTab({
      url: '/pages/homepage/index'
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.fetchActivityInfo()
    this.fetchRegusersList()
    this.fetchBannerImage()
    // Sunny add for 详情小程序码 at 19-10-21
    // this.fetchAccesToken()
    this.getPageQrcode()
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    if (this.animation) {
      this.hideMenuModal()
    }
    return {
      title: this.data.list.title,
    }
  },
  updateUI: function (e) {
    this.fetchRegusersList()
    this.setData({
      'list.isRegister': '1'
    })
  },
  // 是否显示引导页
  showIntroduceInfo: function () {
    this.introduce.clickMask()
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
        page: 'pages/activity/detail/detail',
        scene: that.data.id,
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
      // urls: [],
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
    var canHeight = 680

    var that = this;
    var context = wx.createCanvasContext('mycanvas');
    context.setFillStyle("#fff")
    context.fillRect(0, 0, canWidth, canHeight)

    //发布者
    //绘制头像图片  先画圆形，制作圆形头像(圆心x，圆心y，半径r)     
    let headImgSize = step2 * 2
    context.strokeStyle = "#fff";
    context.save()
    context.beginPath()
    context.arc(text_x + step2, text_y + step2, step2, 0, 2 * Math.PI) //画出圆
    context.clip(); //裁剪上面的圆形
    context.drawImage(that.data.headerPath, text_x, text_y, headImgSize, headImgSize)
    context.restore();
    context.stroke();

    text_y = text_y + step2
    context.setFontSize(14)
    context.setFillStyle('#0178dd');
    context.fillText(that.data.list.publisherInfo.name, text_x + 65, text_y - 4);
    text_y = text_y + step1
    context.setFillStyle('#000');
    context.fillText('邀你一起参加活动，快来报名吧~', text_x + 65, text_y);
    text_y = text_y + step2

    //投图
    var bgPath = this.data.bgPath ? this.data.bgPath : '/images/default/dpartner2.png'
    context.drawImage(bgPath, 10, text_y, canWidth - 20, 225);
    text_y += text_y + 165

    //标题文字
    context.setFontSize(20);
    context.setFillStyle('#000');
    text_y = this.canvasMeasureText(context, that.data.list.title, text_x, text_y, step2)
    text_y += step2

    //开始时间
    var icon_w = 18
    context.setFontSize(14);
    text_y = text_y
    var ic_timePath = '/images/icon/time.png'
    context.drawImage(ic_timePath, text_x, text_y - 15, icon_w, icon_w);
    context.fillText(this.data.start, text_x + icon_w + 10, text_y);
    text_y = text_y + step2
    //活动地点
    var address = this.data.list.address
    var ic_addrPath = '/images/icon/addr.png'
    context.drawImage(ic_addrPath, text_x, text_y - 15, icon_w, icon_w);
    text_y = this.canvasMeasureText(context, address, text_x + icon_w + 10, text_y, step2)
    text_y = text_y + step1

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
    console.log('保存图片save')
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
            console.log('保存图片成功')
            console.log(res)
            if (res.confirm) {
              console.log('用户点击确定');
              /* 该隐藏的隐藏 */
              that.setData({
                maskHidden: false
              })
            }
          }, fail: function (res) {
            console.log('保存图片失败了')
            console.log(res)
          }
        })
      }, fail: function (err) {
        console.log('保存图片失败')
        console.log(err)
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
    if (animation) {
      animation.translate(0, 0).step();
      this.setData({
        maskHidden: false,
        animationData: animation.export()
      });
    }
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
    console.log('exit')
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
    animation.translate(0, -165).step();
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
  showImage: function(e) {
    var current = e.target.dataset.src;   //这里获取到的是一张本地的图片

    wx.previewImage({
      // urls: [],
      current: current,//需要预览的图片链接列表
      urls: [current] //当前显示图片的链接
    })
  },
})