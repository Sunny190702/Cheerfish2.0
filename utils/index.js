// 从本地storage获取数据
const getDataFromStorage = key => {
  return wx.getStorageSync(key);
};

// 把数据存入本地storage
const setDataToStorage = obj => {
  for (let o in obj) {
    wx.setStorageSync(o, obj[o]);
  }
};

// 保持屏幕常亮
const keepScreenOn = () => {
  wx.setKeepScreenOn({
    keepScreenOn: true
  });
};

const showToast = (title, icon = "none") => {
  wx.showToast({
    title,
    icon
  });
};

// promise包裹
const promiseWrapper = func =>
  new Promise((resolve, reject) => {
    func({
      success: function(res) {
        return resolve(res);
      },
      fail: function(err) {
        return reject(err);
      }
    });
  });

const setAppData = (app, res) => {
  const {
    phone,
    avatar_url,
    userId,
    username,
    email,
    avatarUrl,
    _id,
    alerts
  } = res
  app.globalData.isLogin = true
  app.globalData.isVerify = phone ? true : false
  if (phone) app.globalData.phone = phone
  app.globalData.avatarUrl = avatar_url || avatarUrl
  app.globalData.userId = userId || _id
  app.globalData.username = username
  if (email) app.globalData.email = email
  if(alerts){
    wx.setStorageSync('alertData', alerts)
  }
}

module.exports = {
  getDataFromStorage,
  setDataToStorage,
  keepScreenOn,
  showToast,
  promiseWrapper,
  setAppData
};