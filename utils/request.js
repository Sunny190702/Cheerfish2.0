const utils = require("./index.js");
const commonUtil = require("./common.js");

const wxRequest = params => {
  const {
    url,
    method,
    data,
    auth = true,
    header = {},
    loadTitle= '加载中',
    showToast = true
  } = params;
  showToast &&
    wx.showLoading({
      title: loadTitle
    });
  if (auth) {
    const token = wx.getStorageSync("token") || "";
    header[commonUtil.reqHeaders.Authorization] = token;
  }
  wx.request({
    url,
    method,
    data,
    header,
    success: function(res) {
      if (res.data.errcode === 200) {
        params.success && params.success(res.data.data);
      } else if (res.data.errcode === 401) {
        wx.removeStorageSync('token')
        showToast && utils.showToast("登录已过期 请重新登录");
        params.fail && params.fail(res.data);
      }else{
        showToast && utils.showToast("请求失败，请重试");
        params.fail && params.fail(res.data);
      }
    },
    fail: function(err) {
      console.log(err);
      showToast && utils.showToast("网络连接失败，请重试");
      params.fail && params.fail(err);
    },
    complete: function(err) {
      wx.hideLoading();
    }
  });
};

module.exports = wxRequest;
