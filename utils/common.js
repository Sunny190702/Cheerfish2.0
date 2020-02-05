// 自定义请求头
const reqHeaders = {
  WX_HEADER_CODE: "X-WX-Code",
  WX_HEADER_ENCRYPTED_DATA: "X-WX-Encrypted-Data",
  WX_HEADER_IV: "X-WX-IV",
  Authorization: "Authorization"
};

// 映射
const mapFreq = {
  'WEEKLY': '每周',
  'DAILY': '每天',
  'MONTHLY': '每月',
  'NONE': '',
}

const alertArray = [{
    text: '不提醒',
    value: 0,
  },
  {
    text: '事件发生时',
    value: -5
  },
  {
    text: '5分钟前',
    value: -5 * 60
  },
  {
    text: '15分钟前',
    value: -15 * 60
  },
  {
    text: '30分钟前',
    value: -30 * 60
  },
  {
    text: '一小时前',
    value: -60 * 60,
  },
  {
    text: '2小时前',
    value: -120 * 60
  },
  {
    text: '1天前',
    value: -24 * 60 * 60
  },
  {
    text: '2天前',
    value: -2 * 24 * 60 * 60
  },
]

const freqArray = [{
    text: '不重复',
    value: 'NONE'
  },
  {
    text: '每天重复',
    value: 'DAILY'
  },
  {
    text: '每周重复',
    value: 'WEEKLY',
  },
  {
    text: '每月重复',
    value: 'MONTHLY'
  },
  // {text: '工作日重复（周一至周五）',value: ''},
]

const mapAlert = {
  'sms': {img: '/images/alert/sms.png', text: '短信提醒'},
  'wxmsg':{img: '/images/alert/wechat.png', text: '微信提醒'},
  'call': {img: '/images/alert/call.png', text: '电话提醒'},
  'email': {img: '/images/alert/email.png',text: '邮件提醒'},
}

const alertType = [
  { value: 'sms', text: '短信提醒'},
  { value: 'wxmsg', text: '微信提醒'},
  { value: 'call', text: '电话提醒'},
  { value: 'email', text: '邮件提醒'}
]

function formatAlertText(data){
  if(data instanceof Array && data[0]){
    return mapAlert[data[0].by].text + '等'
  } else {
    return '暂无'
  }
}

module.exports = {
  reqHeaders,
  mapFreq,
  alertArray,
  freqArray,
  mapAlert,
  alertType,
  formatAlertText
};