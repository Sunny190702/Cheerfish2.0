// pages/activity/new/content.js
// const Multipart = require('../../../utils/Multipart.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: [],
    picList:[],
    contentList:[],
    contentMsg:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("options.model " + options.model)
    console.log("options.msg " + options.msg)
    if (options && options.model) {
      var list = JSON.parse(options.model)
      // console.log('activity new content options.model is ' + options.model)
      // console.log('activity new content list is ' + list)
      this.setData({
        dataList: list,
        contentMsg: options.msg
      })
    }

    
  
  },

  chooseImage: function () {
    if (this.data.dataList.length > 8) {
      wx.showToast({
        title: '图片添加已达上限',
        icon: 'success',
        duration: 1000,
        mask: true
      })
      return
    } 
    const that = this;
    wx.chooseImage({  //从本地相册选择图片或使用相机拍照
      count: 9, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        //前台显示 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let tempFilePaths = res.tempFilePaths
        that.putDataList(tempFilePaths)
      }
    })
  },

  //把图片添加到列表list中
  putDataList: function (dataArr) {
    var tmpList = []
    for (var i = 0; i < dataArr.length; i++) {
      tmpList[i] = { 
        picture: dataArr[i],
        content: ''
      }
    }

    this.data.dataList.push.apply(this.data.dataList, tmpList)
    this.setData({
      dataList: this.data.dataList,
    })
  },

  /*
    删除已添加的图片
    图片描述文字随图片删除而删除
  */
  removeImage: function(e) {
    const idx = e.target.dataset.idx
    this.data.dataList.splice(idx, 1)
    this.setData({
      dataList: this.data.dataList
    })
    // this.data.picList.splice(idx, 1)
    // // $digest(this)
    // this.setData({
    //   picList: this.data.picList
    // })
  },

  /*更新已添加的图片*/
  updatePicture: function(e) {
    const that = this;
    const idx = e.target.dataset.idx
    wx.chooseImage({  //从本地相册选择图片或使用相机拍照
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // that.data.picList[idx] = res.tempFilePaths[0]
        that.data.dataList[idx].picture = res.tempFilePaths[0]
        that.setData({
          dataList: that.data.dataList
        })
      }
    })
  },

  //获取输入框的内容，并赋值到dataList中
  //频繁刷屏影响界面性能,所以不试用该方法
  expInput: function (e) {
    // const idx = e.target.dataset.idx
    // this.data.dataList[idx].content = e.detail.value
 
    // this.setData({
    //   dataList: this.data.dataList,
    // })
  },
  
  handleSubmit(e) {
    var tmpList = this.data.dataList
    for (var i = 0; i < tmpList.length; i++) {
      // console.log("content is " + e.detail.value['content'+i])
      this.data.dataList[i].content = e.detail.value['content' + i]
    }

    this.setData({
      dataList: this.data.dataList,
    })

    // console.log("this.data.dataList is " + JSON.stringify(this.data.dataList))

    // const subdata = {
    //   msg: e.detail.value.msgcontent,
    //   value: this.data.dataList,
    // }

    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面
    //直接调用上一个页面对象的setData()方法，把数据存到上一个页面中去
    prevPage.setData({
      contentList: this.data.dataList,
      contentMsg: e.detail.value.msgcontent
    });
    wx.navigateBack()

    // // var list = this.data.dataList
    // var model = JSON.stringify(subdata);
    // console.log("提交 subdata is " + model)
    // wx.navigateTo({
    //   url: '/pages/activity/new/new?model=' + model,
    // })


    // let fields = Object.keys(subdata).map(key => ({
    //   name: key,
    //   value: subdata[key]
    // }))
    // let files = this.data.files
    // console.log(files)

    // // let url = 'http://'
    // // new Multipart({
    // //   files,
    // //   fields
    // // }).submit(url, { header: { 'Cookie': 'name=1' } })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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

  }
})