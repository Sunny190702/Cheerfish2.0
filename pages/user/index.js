// pages/home/new/new.js
const app = getApp()
Page({
  data: {
    focusInput: false,
    showWrap: false,
    type: '',
    currentDate: {},
    startTime: '',
    time: '',
    endTime: '',
    source: '',
    filePath: '',
    array: ['其他', '学士', '硕士', '博士'],
    index: '',

    policyChecked: false,
    educationArray: [{
        id: '3',
        name: '博士'
      },
      {
        id: '2',
        name: '硕士'
      },
      {
        id: '1',
        name: '学士'
      },
      {
        id: '0',
        name: '其他'
      }
    ],
    edcuationIndex: ''
  },
  onLoad: function(options) {
    // 没授权过的用户注册前需要先授权
    this.typeFrom = options.type
    console.log("onload 注册界面来源于 —— " + this.typeFrom)
    if (!app.globalData.userInfo) {
      console.log("先授权 —— ")
      //关闭当前页面,进入注册界面，避免不注册返回界面错误
      wx.redirectTo({
        url: "/pages/index/index?action=author&typeFrom=" + this.typeFrom,
      })
      return
    }
    console.log("已授权 —— ")
    this.completeUserInfoUrl = app.globalData.cheerFishHost + 'completeUserInfo'
    wx.hideShareMenu()
    // this.toast = this.selectComponent('.toast')
    this.showSkip = false
    this.edcuationIndex = ''
    if (options.action === 'completeUserInfo') {
      this.showCompleteComponents = true
      this.action = 'completeUserInfo'
      this.showSkip = true
    } else if (options.action === 'authentication') {
      this.showCompleteComponents = true
      this.action = 'authentication'
    } else {
      this.showCompleteComponents = false
      this.action = 'edit'
    }
    // this.data.educationArray.forEach((element, index, array) => {
    //   if (parseInt(element.id) == parseInt(app.globalData.userInfo.userBaseInfo.education)) {
    //     this.edcuationIndex = index
    //   }
    // });
    this.setData({
      header: app.globalData.userInfo ? app.globalData.userInfo.userBaseInfo.header : '',
      userInfo: app.globalData.userInfo,
      showCompleteComponents: this.showCompleteComponents,
      showSkip: this.showSkip,
      edcuationIndex: this.edcuationIndex
    })
  },

  onEducationPickerChangeHandler: function(e) {
    this.setData({
      edcuationIndex: e.detail.value
    })
  },
  _showTipDialog: (content) => {
    wx.showModal({
      title: '提示',
      content: content,
      showCancel: false,
    })
  },
  onPolicyCheckedHandler: function(e) {
    this.setData({
      policyChecked: !this.data.policyChecked
    })
  },
  onCompleteUserInfoHandler: function(e) {
    console.log(e.detail.value)
    let formData = e.detail.value
    formData.gender = app.globalData.userInfo.userBaseInfo.gender
    if (formData.name === '') {
      this._showTipDialog('请输入姓名')
      return
    }
    if (formData.school === '') {
      this._showTipDialog('请输入学校信息')
      return
    }
    // if (formData.education === '') {
    //   this._showTipDialog('请输入学历信息')
    //   return
    // } else {
    //   formData.education = this.data.educationArray[formData.education].id
    // }
    // if (formData.company === '') {
    //   this._showTipDialog('请输入单位信息')
    //   return
    // }
    // if (formData.position === '') {
    //   this._showTipDialog('请输入职务')
    //   return
    // }
    if (formData.phone === '' || formData.phone.length != 11) {
      this._showTipDialog('请输入正确的手机号码')
      return
    }
    // if (formData.address === '') {
    //   this._showTipDialog('请输入通信地址')
    //   return
    // }
    if (formData.wxId === '') {
      this._showTipDialog('请输入真实的微信号')
      return
    }    
    if ((this.action === 'completeUserInfo' || this.action === 'authentication') && !this.data.policyChecked) {
      this._showTipDialog('请阅读隐私政策和服务协议')
      return
    }
    console.log('finish formData=' + JSON.stringify(formData))
    if (this.headerFilePath) {
      this._uploadUserInfoWithHeader(formData, this.headerFilePath)
    } else {
      this._uploadUserInfo(formData)
    }
  },

  _uploadUserInfoWithHeader: function(formData, headerFilePath) {
    wx.showLoading({
      title: '上传中'
    })
    wx.uploadFile({
      url: this.completeUserInfoUrl,
      filePath: headerFilePath,
      name: 'header',
      formData: formData,
      header: {
        'content-type': 'multipart/form-data',
        'appId': app.globalData.appId,
        'userIdentity': app.globalData.userInfo ? app.globalData.userInfo.identity : ''
      },
      method: "POST",
      success: res => {
        if (res.statusCode === 200) {
          console.log(JSON.stringify(res.data))
          let responseInfo = JSON.parse(res.data);
          if (responseInfo.code === 10000) {
            // this.toast.show('认证成功')
            wx.showToast({
              title:  '注册成功',
              icon: 'none',
              duration: 2000,
              mask: true
            })
            responseInfo.data.userBaseInfo.header = app.globalData.pictureHost + responseInfo.data.userBaseInfo.header;
            app.globalData.userInfo = responseInfo.data
            wx.setStorageSync('userInfo', app.globalData.userInfo)
            if (this.action === 'completeUserInfo') {
              //填写个人信息后返回上一个界面
              var pages = getCurrentPages();
              var prevPage = pages[pages.length - 2];  //上一个页面
              //直接调用上一个页面对象的setData()方法，把数据存到上一个页面中去
              if (prevPage != null) {
                prevPage.setData({
                  target: 1,
                  type: this.typeFrom
                });
                wx.navigateBack()
              } else {
                // wx.navigateTo({
                //   url: '/pages/home/home',
                // })
                wx.switchTab({
                  url: '/pages/homepage/index',
                })
              }
              console.log("注册成功，返回上一界面 —— ")
              return
            }
            wx.switchTab({
              url: '/pages/profile/profile',
              success: function (e) {
                var page = getCurrentPages().pop();
                if (page == undefined || page == null) return;
                page.onShow();
              }
            })
          } else {
            // this.toast.show('认证失败')
            wx.showToast({
              title: '注册失败',
              icon: 'none',
              duration: 2000,
              mask: true
            })
          }

        } else {
          // this.toast.show('服务器忙')
          wx.showToast({
            title: '服务器忙',
            icon: 'none',
            duration: 2000,
            mask: true
          })
        }

      },
      fail: (error) => {
        // this.toast.show('上传失败,请重试')
        wx.showToast({
          title: '上传失败,请重试',
          icon: 'none',
          duration: 2000,
          mask: true
        })
      },
      complete: () => {
        wx.hideLoading();
      }
    })
  },
  _uploadUserInfo: function(formData) {
    wx.showLoading({
      title: '上传中'
    })
    wx.request({
      url: this.completeUserInfoUrl,
      data: formData,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'appId': app.globalData.appId,
        'userIdentity': app.globalData.userInfo ? app.globalData.userInfo.identity : '',
      },
      method: "POST",
      success: res => {
        if (res.statusCode === 200) {
          console.log(JSON.stringify(res.data))
          if (res.data.code === 10000) {
            res.data.data.userBaseInfo.header = app.globalData.pictureHost + res.data.data.userBaseInfo.header;
            app.globalData.userInfo = res.data.data
            wx.setStorageSync('userInfo', app.globalData.userInfo)
            console.log('thisaction='+this.action)
            // if (this.action === 'completeUserInfo') {
              //填写个人信息后返回上一个界面
              var pages = getCurrentPages();
              var prevPage = pages[pages.length - 2];  //上一个页面
              //直接调用上一个页面对象的setData()方法，把数据存到上一个页面中去
              if (prevPage != null) {
                prevPage.setData({
                  target: 1,
                  type: this.typeFrom
                });
                wx.navigateBack()
              } else {
                // wx.navigateTo({
                //   url: '/pages/home/home',
                // })
                wx.switchTab({
                  url: '/pages/homepage/index',
                })
              }
            // } else {
            //   wx.navigateBack();
            // }
          } else {
            wx.showToast({
              title: '上传失败',
              icon: 'none',
              duration: 2000,
              mask: true
            })
          }
        } else {
          wx.showToast({
            title: '服务器忙',
            icon: 'none',
            duration: 2000,
            mask: true
          })
        }

      },
      fail: (error) => {
        // this.toast.show('上传失败,请重试')
        wx.showToast({
          title: '上传失败,请重试',
          icon: 'none',
          duration: 2000,
          mask: true
        })
      },
      complete: () => {
        wx.hideLoading();
      }
    })

  },
  onChooseHeaderHandler: function() {
    wx.chooseImage({
      count: 1, //最多可以选择的图片总数  
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'],
      success: res => {
        this.headerFilePath = res.tempFilePaths[0]
        this.setData({
          header: this.headerFilePath
        })
      }
    })
  },

  // 监听页面显示
  onShow: function (options) {
    console.log("返回注册界面 is " + options)
    if (this.data.target === 1) {
      const userLevel = app.globalData.userInfo ? app.globalData.userInfo.accountLevel : 0
      if (userLevel > 0) {
        console.log("已经注册过的用户返回上一界面——" + this.typeFrom)
        //已经注册过的用户返回上一界面
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];  //上一个页面
        //直接调用上一个页面对象的setData()方法，把数据存到上一个页面中去
        prevPage.setData({
          target: 1,
          type: this.typeFrom
        });
        wx.navigateBack()
      } else {
        console.log("未注册过的用户先注册")
      }
    } else {
      console.log("其他方式返回,直接返回上一界面")
      console.log("this.data.target = " + this.data.target)
      console.log("this.typeFrom = " + this.typeFrom)
      // wx.navigateBack()
    }
  },
  showload: function() {
    wx.showLoading({
      title: '加载中',
    })

    setTimeout(function() {
      wx.hideLoading()
    }, 20000)

  },


  handleSubmit(e) {
    const data = e.detail.value
    console.log('data', e)
    const {
      company,
      education,
      name,
      phone,
      position,
      school,
      address,
      wxId,
    } = e.detail.value
    const filePath = this.data.filePath
    if (name == "") {
      wx.showModal({
        title: '提示',
        content: '请输入真实姓名',
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
    } else if (school == "") {
      wx.showModal({
        title: '提示',
        content: '请输入毕业学校/学院信息',
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
    } else if (education == "") {
      wx.showModal({
        title: '提示',
        content: '请选择学历',
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
    } else if (company == "") {
      wx.showModal({
        title: '提示',
        content: '请输入单位名称或品牌名称',
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
    } else if (position == "") {
      wx.showModal({
        title: '提示',
        content: '请输入就职职务',
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
    } else if (phone == "" || phone.length != 11) {
      wx.showModal({
        title: '提示',
        content: '请输入正确的手机号码',
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
    } else if (!this.data.edit && filePath == "") {
      wx.showModal({
        title: '提示',
        content: '请输入真实头像信息',
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
    } else if (address == "") {
      wx.showModal({
        title: '提示',
        content: '请输入通信地址',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
    } else if (wxId == "") {
      wx.showModal({
        title: '提示',
        content: '请输入真实微信号',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
    } 
    else {
      if (this.data.edit || this.data.isChecked) {
        console.log("source is " + this.data.source)
        this.postCompleteUserInfo(data)
      } else {
        wx.showModal({
          title: '提示',
          content: '请阅读隐私政策和服务协议',
          success: function(res) {
            if (res.confirm) {
              console.log('用户点击确定')
            }
          }
        })
      }
    }
  },
  postCompleteUserInfo(data) {
    const userinfo = {
      ...data,
      gender: this.data.userInfo.gender
    }
    console.log('最终用户数据', )
    wx.uploadFile({
      url: app.globalData.cheerFishHost + 'completeUserInfo',
      filePath: this.data.filePath,
      name: 'header',
      formData: userinfo,
      header: {
        'content-type': 'multipart/form-data',
        'appId': app.globalData.appId,
        'userIdentity': app.globalData.userInfo ? app.globalData.userInfo.identity : ''
      },
      method: 'POST',
      success: res => {
        const resJosn = JSON.parse(res.data)
        console.log('resJosn', resJosn)
        if (resJosn.code == 10000) {
          wx.showToast({
            title: '注册成功',
            icon: 'success',
            duration: 2000
          })
          console.log('uploadFile success', res.data)
          wx.setStorageSync('completeUserInfo', resJosn.data.userBaseInfo)
          let info = wx.getStorageSync('userInfo')
          info.accountLevel = '2'
          wx.setStorageSync('userInfo', info)
          wx.switchTab({
            // url: '/pages/home/home'
            url: '/pages/homepage/index',
          })
        } else {
          console.log('res', res)
          wx.showToast({
            title: '注册失败',
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail: res => {
        // wx.showLoading({
        //   title: 'false'
        // })
        console.log('uploadFile false', res)
      },
      complete: res => {
        wx.setStorageSync("hasShowIntroduceInfo", false)
        // wx.showLoading({
        //   title: 'complete'
        // })
        // wx.hideLoading()
      }
    })
  },
  onSkipHandler: function(e) {
    if (this.action === 'completeUserInfo') {
      //跳过注册反馈上一级界面
      console.log("跳过，返回上一界面 —— ")
      wx.navigateBack()
    } else {
      // wx.switchTab({
      //   url: '/pages/home/home'
      // })
      wx.switchTab({
        url: '/pages/homepage/index',
      })      
    }
  },

  toMenuForPrivacy: function() {
    wx.navigateTo({
      url: "/pages/profile/static/privacy"
    })
  },
  toMenuForService: function() {
    wx.navigateTo({
      url: "/pages/profile/static/service"
    })
  },
  onUnload: function() {
    //返回上一级
    // if (this.action === 'edit') {
    //   console.log("编辑个人信息返回上一级")
    // } else if (this.action === 'completeUserInfo') {
    //   console.log("返回上一级")
    // } else {
    //   wx.reLaunch({
    //     url: "/pages/home/home",
    //   })
    // }
  },
  getPhoneNumber: function (e) {
    var that = this;
    console.log(e.detail.errMsg == "getPhoneNumber:ok");
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      wx.request({
        url: 'http://localhost/index/users/decodePhone',
        data: {
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv,
          sessionKey: that.data.session_key,
          uid: "",
        },
        method: "post",
        success: function (res) {
          console.log(res);
        }
      })
    }
  },
})