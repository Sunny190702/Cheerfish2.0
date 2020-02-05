const config = require("../config");
const utils = require("./index.js");
const wxRequest = require("./request.js");

// 收集formId
function collectFormId(formIds) {
  wxRequest({
    url: config.api.system.addFormId.url,
    method: config.api.system.addFormId.method,
    data: {
      formIds
    },
    showToast: false
  });
}

// 检查用户状态
const checkLogin = cb => {
  let token = utils.getDataFromStorage("token");
  let userId = utils.getDataFromStorage("userId");
  let username = utils.getDataFromStorage("username");
  let phone = utils.getDataFromStorage("phone");
  let avatarUrl = utils.getDataFromStorage("avatarUrl");
  let email = utils.getDataFromStorage("email");
  // let userInfo = utils.getDataFromStorage("userInfo");
  if (token && userId && username) {
    cb({
      success: true,
      token,
      username,
      userId,
      phone,
      avatarUrl,
      email
      // userInfo
    });
  } else {
    cb({
      success: false
    });
  }
};

// 用户注册登录
const postUser = (data, cb) => {
  wx.showLoading({
    title: "登录中",
    icon: "none"
  });
  wxRequest({
    url: config.api.user.login.url,
    method: config.api.user.login.method,
    data: data,
    showToast: false,
    auth: false,
    success: function(res) {
      utils.showToast("登录成功");
      utils.setDataToStorage({
        token: res.token,
        userId: res.userId,
        phone: res.phone,
        username: res.username,
        avatarUrl: res.avatar_url,
      });
      wx.hideLoading();
      cb({
        success: true,
        ...res
      });
    },
    fail: function(err) {
      config.logger(err);
      utils.showToast("登录失败，请重试");
      cb({
        success: false
      });
    }
  });
};

const wxLogin = (userData, cb) => {
  if (userData.errMsg === "getUserInfo:fail auth deny") {
    utils.showToast("您拒绝了授权用户信息");
  } else {
    wx.login({
      success: res => {
        userData.code = res.code;
        utils.setDataToStorage({
          userInfo: userData.userInfo
        })
        delete userData.errMsg
        delete userData.rawData
        delete userData.userInfo
        postUser(userData, res => {
          cb && cb(res);
        });
      }
    });
  }
};

const postPhone = (data, cb) => {
  wx.showLoading({
    title: "请稍候"
  });
  wxRequest({
    url: config.api.user.getPhone.url + data.userId + '/phone',
    method: config.api.user.getPhone.method,
    data: data,
    showToast: false,
    success: function(res) {
      config.logger(res);
      utils.setDataToStorage({
        phone: res.phone
      });
      cb({
        phone: res.phone,
        success: true,
      });
    },
    fail: function(err) {
      config.logger(err);
      utils.showToast("获取手机号失败，请重试");
      cb({
        success: false
      });
    }
  });
};

module.exports = {
  checkLogin,
  wxLogin,
  postPhone,
  collectFormId,
  postUser
};