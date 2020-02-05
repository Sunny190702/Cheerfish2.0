const app = getApp()
var animation;
Page({
  data: {
    item: {
    },
    showModal: false,
    loadingHidden: false,
    //显示注册引导页
    showIntroduceInfo:true,
    // 订阅消息
    maskHidden:false,
    qrCodeTmpPath:'',
    animationData: {},
    isReady: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options', this.options)

    //显示注册引导页
    if (wx.getStorageSync("hasShowIntroduceInfo") === '1') {
      this.data.showIntroduceInfo = false
    }
    this.setData({
      systemInfo: app.globalData.systemInfo,
      pictureHost: app.globalData.pictureHost,
      showIntroduceInfo: this.data.showIntroduceInfo,
    })


    if (options.id) {
      this.setData({ id: options.id });
    } else {
      this.setData({ id: decodeURIComponent(options.scene) });
    }
  },
  // Sunny add for 详情小程序码 at 19-10-21
  fetchAccesToken: function() {
    console.log("appid = "+ app.globalData.appId)
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

  fetchData: function (){
    const url = app.globalData.cheerFishHost + 'api/cooperations/' + this.data.id
    const that = this
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
          const reslist = res.data.data
          const userLevel = app.globalData.userInfo ? app.globalData.userInfo.accountLevel : 0
          
          console.log('partner item ', reslist)
          const numberLen = reslist.phone.length > 2 ? 3 : reslist.phone.length
          const emailLen = reslist.email.length > 2 ? 3 : reslist.phone.length
          if (userLevel < 1) {
            this.setData({
              item: reslist,
              updatedAt: reslist.updatedAt.replace('T', '  '),
              phoneNumber: '点击查看',
              emailAddr: '点击查看',
              wxId: '点击查看',
            })
          } else {
            this.setData({
              item: reslist,
              updatedAt: reslist.updatedAt.replace('T', '  '),
              phoneNumber: reslist.phone,
              emailAddr: reslist.email,
              wxId:reslist.wxId,
              showcallIcon: reslist.phone.length > 4 ? true : false
            })
          }

          wx.downloadFile({
            url: that.data.pictureHost + that.data.item.publisherInfo.header,
            success(res) {
              if (res.statusCode === 200) {
                that.setData({
                  headerPath: res.tempFilePath,
                })
              }
            }
          })
          // start
          //游客注册完毕后反馈详情界面执行原操作
          //this.data.target === 1 表示从注册界面返回
          if (this.data.target === 1 && userLevel > 0) {
            if (this.data.type === 'reports') {
              this.modal.clickMask()
            } else if (this.data.type === 'order') {
              this.orderPartner()
            } else if (this.data.type === 'collect') {
              if (reslist.isFavorite == '1') {
                wx.showToast({
                  title: '已收藏',
                  icon: 'success',
                  duration: 2000
                })
              } else {
                this.collectPartner()
              }
            }
          }
          //end
        }

      },
      fail: res => {
        console.log('partner item flase')
      }
    })
  },
  fetchBackgroundImage: function () {
    const that = this
    const header = {
      'appId': app.globalData.appId,
      'userIdentity': app.globalData.userInfo ? app.globalData.userInfo.identity : ''
    }

    wx.request({
      url: app.globalData.cheerFishHost + 'api/info-backgrounds',
      data: {
        type: 4
      },
      header: header,
      method: 'GET',
      success: res => {
        if (res.statusCode === 200) {
          if (res.data.code === 10000) {
            this.setData({
              uploadItem: res.data.data.background,
            })
            wx.downloadFile({
              url: that.data.pictureHost + that.data.uploadItem,
              success(res) {
                if (res.statusCode === 200) {
                  that.setData({
                    bgPath: res.tempFilePath,
                  })
                }
              }
            })
          }
        }
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.modal = this.selectComponent("#modal");
    this.introduce = this.selectComponent("#introduce")
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


  joinTap: function (e) {
    const userLevel = app.globalData.userInfo ? app.globalData.userInfo.accountLevel : 0
    console.log("userLevel is " + userLevel)
    if (userLevel > 0) {
      this.orderPartner()
    } else {
      wx.navigateTo({
        url: "/pages/user/index?action=completeUserInfo&type=order"
      })
    }
  },

  orderPartner: function () {
    const that = this
    const item = that.data.item
    console.log('item', item)
    wx.showModal({
      title: '联系方式',
      showCancel: false,
      confirmText: '返回',
      content: '电话:' + item.phone + '\r\n' + '邮箱:' + item.email + '\r\n' + '联系时请说明信息来源于“名校精英”',
      success(res) {
        if (res.confirm) {
          // that.setModelInfo()
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  setModelInfo: function (type) {
    // 成功后订阅模板消息后可報名成功
    const that = this
    wx.requestSubscribeMessage({
      tmplIds: [app.globalData.tmplId1, app.globalData.tmplId2],
      success(res) {
        console.log(res)
      },
      fail(res) {
        console.log(res)
      }, complete: function (res) {
        console.log("requestSubscribeMessage")
      },
    })
  },
  collect: function () {
    const userLevel = app.globalData.userInfo ? app.globalData.userInfo.accountLevel : 0
    console.log("userLevel is " + userLevel)
    if (userLevel > 0) {
      this.collectPartner()
    } else {
      wx.navigateTo({
        url: "/pages/user/index?action=completeUserInfo&type=collect"
      })
    }
  },
  collectPartner: function () {
    const that = this
    const item = that.data.item
    if (item.isFavorite == '1') {
      wx.request({
        url: app.globalData.cheerFishHost + 'api/cooperation-favorites/' + item.id,
        data: { "cooperationtId": item.id },
        header: {
          'appId': app.globalData.appId,
          'userIdentity': app.globalData.userInfo ? app.globalData.userInfo.identity : ''
        },
        method: 'DELETE',
        success: res => {
          console.log('item favorities success ', res)
          if (res.statusCode === 200) {
            wx.showToast({
              title: '取消收藏',
              icon: 'success',
              duration: 2000
            })
            that.setData({
              'item.isFavorite': '0'
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
        url: app.globalData.cheerFishHost + 'api/cooperation-favorites',
        data: { "cooperationId": item.id },
        header: {
          'appId': app.globalData.appId,
          'userIdentity': app.globalData.userInfo ? app.globalData.userInfo.identity : ''
        },
        method: 'POST',
        success: res => {
          console.log('item favorities success ', res)
          if (res.statusCode === 200) {
            wx.showToast({
              title: '收藏成功',
              icon: 'success',
              duration: 2000
            })
            that.setData({
              'item.isFavorite': '1'
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
    this.fetchData()
    this.fetchBackgroundImage()
    this.fetchBannerImage()
    // Sunny add for 详情小程序码 at 19-10-21
    // this.fetchAccesToken()
    this.getPageQrcode()
  },

  // 生成页面的二维码
  getPageQrcode: function() {
    const that = this

    wx.request({
      url: app.globalData.cheerFishHost + 'api/w-xacode',
      data:{
        page: 'pages/partner/detail/detail',
        scene: that.data.id,
      },
      header: {
        'appId': app.globalData.appId,
        'userIdentity': app.globalData.userInfo ? app.globalData.userInfo.identity : ''
      },
      method:'GET',
      success(res){
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
      } ,
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
    if (this.data.item.type == 0) {
      return {
        title: this.data.item.enterpriseName,//+ "寻求" + "融资合作"
        imageUrl: '/images/default/spartner_1.png',
      }
    } else if (this.data.item.type == 1) {
      return {
        title: this.data.item.enterpriseName,// + "寻求" + "投资项目"
        imageUrl: '/images/default/spartner_2.png',
      }
    } else {
      return {
        title: this.data.item.enterpriseName,// + "寻求合作"
        imageUrl: '/images/default/spartner_3.png',
      }
    } 
  },
  copyText: function (e) {
    console.log(e)
    const userLevel = app.globalData.userInfo ? app.globalData.userInfo.accountLevel : 0
    if (userLevel > 0) {
      wx.setClipboardData({
        data: e.currentTarget.dataset.text,
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
    } else {
      //注册
      wx.navigateTo({
        url: "/pages/user/index?action=completeUserInfo"
      })
    }
  },
  callPhoneNumber: function () {
    console.log('this.data.phoneNumber ' + this.data.phoneNumber)
    const userLevel = app.globalData.userInfo ? app.globalData.userInfo.accountLevel : 0
    const numberLen = this.data.phoneNumber.length
    if (userLevel > 0 && numberLen > 4) {
      wx.makePhoneCall({
        phoneNumber: this.data.phoneNumber,
      })
    } else {
      //注册
      wx.navigateTo({
        url: "/pages/user/index?action=completeUserInfo"
      })
    }
  },
  // 是否显示引导页
  showIntroduceInfo: function () {
    this.introduce.clickMask()
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
    context.fillText(that.data.item.publisherInfo.name, text_x + 65, text_y - 5);
    text_y = text_y + step1
    context.setFillStyle('#000');
    text_y = this.canvasMeasureText(context, that.data.item.publisherInfo.school, text_x + 65, text_y - 4, step1 - 5, canWidth - text_x * 2 - 60)
    text_y = text_y + step1

    //投图
    // var bgPath = this.data.bgPath ? this.data.bgPath : '/images/default/ic_share.png'
    var bgPath = '/images/default/ic_share.png'
    context.drawImage(bgPath, 0, text_y, canWidth, 94);

    text_y = text_y + 94 + step1
    //标题文字(超长换行)
    context.setFontSize(20)
    context.setFillStyle('#000')
    var title = this.data.item.enterpriseName
    text_y = this.canvasMeasureText(context, title, text_x, text_y, step2, canWidth - text_x * 2)
    text_y += step2;

    //发布时间
    context.setFontSize(14)
    context.setFillStyle('#000')
    context.fillText('发布时间：' + this.data.updatedAt, text_x, text_y)
    text_y = text_y + step1


    //类别 浏览量
    let type = '其他合作'
    if (this.data.item.type == 0) {
      type = '找资金'
    } else if (this.data.item.type == 1) {
      type = '找项目'
    } else if (this.data.item.type == 2) {
      type = '找人'
    }
    context.setFontSize(14);
    context.setFillStyle('#000');
    context.fillText(type, text_x, text_y);

    var ic_timePath = '/images/img/view.png'
    context.drawImage(ic_timePath, text_x + 100, text_y - 11, 14, 10);
    context.fillText(this.data.item.hot, text_x + 120, text_y);
    text_y = text_y + step2
    context.restore(); 
 
    //绘制小程序二维码
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
          console.log("settimeout res is "+ JSON.stringify(res))
          var tempFilePath = res.tempFilePath;
          that.setData({
            imagePath: tempFilePath,
            canvasHidden: true
          });
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
    console.log('点击保存到相册');
    wx.saveImageToPhotosAlbum({
      filePath: that.data.imagePath,
      success(res) {
        console.log('sucess');
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
            console.log(res)
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
  exit:function(){
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

  canvasMeasureText: function (context, str, text_x, text_y, step, canvasWidth) {
    // var canvasWidth = 340
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
          text_y += 25; //22为 文字大小20 + 2            
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