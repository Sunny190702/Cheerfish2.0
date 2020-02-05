// pages/editor/custom-menu.js
const maxcount = 15
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showInput: false,//新增输入框
    showSelectionLabel: false,
    showAddSelectionBtn: false,
    list:[
      // { label:"123", require: false, type: 0 },
      // { label: "456", require: false, type: 0 },
      ],//新增列表
    selection_list: [
      { options: ''},
      { options: ''},
      { options: ''},
    ],
    selectionValue_list: [],    
    require: false,//必选项
    selectOptions:{},
    typeId:0,//新增条目类型
    showMenuButton: true, //是否显示文本、单选、多选菜单
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /**
     * 先将字符串转化为数组
      1.内容包含msg和value
      2.value里包含picture和content
     */
    console.log("options.model " + options.model)
    if (options && options.model) {
      var list = JSON.parse(options.model)
      console.log(list)
      this.setData({
        list: list
      })
    }
  },
/**
 * 新增一个文本条目
 */
  chooseInput: function () {
    this.data.typeId = 0
    this.setData({
      showInput: true,
      showSelectionLabel: false,
      showAddSelectionBtn: false,
      type:'text'
    })
    console.log("data.typeId is " + this.data.typeId)
  },
  /**
   * 新增一个多行文本条目
   */
  chooseTextarea: function () {
    this.data.typeId = 1
    this.setData({
      showInput: true,
      showSelectionLabel: false,
      showAddSelectionBtn: false,
      type:'text'
    })
    console.log("data.typeId is " + this.data.typeId)
  },
  /**
   * 新增一个单选条目
   */
  chooseRadioButton: function () {
    this.data.typeId = 2
    console.log("data.typeId is " + this.data.typeId)
    this.setData({
      showInput: true,
      showSelectionLabel: true,
      showAddSelectionBtn: true,
      type:'radio'
    })
  },
  /**
   * 新增一个多选条目
   */
  chooseMultipleSelection: function () {
    this.data.typeId = 3
    console.log("data.typeId is " + this.data.typeId)
    this.setData({
      showInput: true,
      showSelectionLabel: true,
      showAddSelectionBtn: true,
      type:'checkbox'
    })
  },
  /**
   * 删除一个条目
   */
  delete(e) {
    const idx = e.target.dataset.idx
    // console.log("delete idx = "+ idx)
    this.data.list.splice(idx, 1)
    this.setData({
      list: this.data.list,
      showMenuButton: true,
    })
  },
/**
 * 确定新增加一个条目
 */
  addCustomMenu: function (option) {
    if (option.detail.value.label) {
      // type为单选或多选，选项至少2个
      // console.log("this.data.typeId is " + this.data.typeId)
      // console.log("option is " + JSON.stringify(option))
      if (this.data.typeId > 1) {
        // console.log("this.data.selection_list is  " + JSON.stringify(this.data.selection_list))
        let selectionCount = 0
        for (let i = 0; i < this.data.selection_list.length; i++) {
          let optionKey = this.data.selection_list[i].options
          if (optionKey.length > 0) {
            this.data.selectOptions[optionKey]=''
            selectionCount++
          } 
        }
        if (selectionCount < 2) {
          // 也可以增加toast提示
          // 这里目前没有去重
          console.log("需添加选项 ")
          wx.showToast({
            title: '至少2个选项',
          })
          selectionCount = 0
          return
        }
      }
      if (this.data.typeId < 2) {
        //新增条目value
        let tmpList = [{
          label: option.detail.value.label,
          type: this.data.type,
          require: false,
        }]
        //增加到list
        this.data.list.push.apply(this.data.list, tmpList)
      } else {
        let tmpSelectionList = [{
          label : option.detail.value.label,
          type: this.data.type,
          require: false,
          options: this.data.selectOptions,
          type: this.data.type,
        }]
        this.data.list.push.apply(this.data.list, tmpSelectionList)
      }

      // 自定义菜单最多10个
      if (this.data.list.length >= maxcount) {
        this.data.showMenuButton = false
      }
      /**
       * list: 自定义条目
       * showInput: 是否显示新增输入框
       * 新增条目类型归零
       * 更新UI:恢复初始状态
       */
      this.setData({
        list: this.data.list,
        selection_list: [
          { options: '' },
          { options: '' },
          { options: '' },
        ],
        showInput: false,
        showSelectionLabel: false,
        showAddSelectionBtn: false,
        type: 0,
        selectOptions:{},
        showMenuButton: this.data.showMenuButton,
      })
    } else {
      wx.showToast({
        title: '请输入标签',
      })
    }
  },

/**
 * 新增项是否设置为必选项
 */
  chooseMustOption: function (e) {
    //获取设置必选项条目的index
    const idx = e.target.dataset.idx
    //修改必选项属性
    this.data.list[idx].require = !this.data.list[idx].require
    //更新list和UI
    this.setData({
      list: this.data.list
    })
  },
  /**
   * 新增单选或多选选项条目
   */
  addSelection: function () {
    //新增条目value
    let tmpList = [{
      options: "",
    }]

    //selection_list
    this.data.selection_list.push.apply(this.data.selection_list, tmpList)

    //选项最多10个
    if (this.data.selection_list.length >= maxcount) {
      this.setData({
        selection_list: this.data.selection_list,
        showAddSelectionBtn: false,
      })
    } else {
      this.setData({
        selection_list: this.data.selection_list
      })
    }
  },
  bindSelectionLabelInput: function (e) {
    const idx = e.target.dataset.idx
    this.data.selection_list[idx].options = e.detail.value
  },
  handleSubmit: function (e) {
    // console.log("handleSubmit e is " + JSON.stringify(e))
    // console.log("this.data.list is " + JSON.stringify(this.data.list))

    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面
    //直接调用上一个页面对象的setData()方法，把数据存到上一个页面中去
    prevPage.setData({
      customlist: this.data.list,
    });
    wx.navigateBack()
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