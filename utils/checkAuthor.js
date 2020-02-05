const base64 = require('./base64.js')
const app = getApp();

function checkAuthor() {
  if (app.globalData.shareInfo && !app.globalData.userInfo) {
    wx.redirectTo({
      url: '/pages/index/index?targetPath=' + app.globalData.shareInfo.targetPath,
    })
    delete app.globalData.shareInfo
    return true
  }
}

module.exports= {
  checkAuthor:checkAuthor
}