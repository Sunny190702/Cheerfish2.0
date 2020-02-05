const formatTime = (date, all = true) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  // const second = date.getSeconds();
  if (all) {
    return (
      [year, month, day].map(formatNumber).join("-") +
      " " + [hour, minute].map(formatNumber).join(":")
    );
  }
  return [year, month, day].map(formatNumber).join("/");
};

const formatNumber = n => {
  n = n.toString();
  return n[1] ? n : "0" + n;
};

const countTime = end => {
  let start = Date.now();
  let leftTime = end - start;
  if (leftTime <= 0) {
    return "";
  }
  let h = Math.floor((leftTime / 1000 / 60 / 60) % 24);
  let m = Math.floor((leftTime / 1000 / 60) % 60);
  let s = Math.floor((leftTime / 1000) % 60);
  return `${formatNumber(h)}:${formatNumber(m)}:${formatNumber(s)}`;
};

const weekMap = {
  0: '周日',
  1: '周一',
  2: '周二',
  3: '周三',
  4: '周四',
  5: '周五',
  6: '周六',
}

const getWeek = (date) => {
  const day = date.getDay()
  return weekMap[day]
}

module.exports = {
  formatTime,
  countTime,
  getWeek
};