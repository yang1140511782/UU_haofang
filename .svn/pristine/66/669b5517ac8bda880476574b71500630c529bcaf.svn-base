const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const forDayTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-')
}

/**
 * 返回 *月*日
 */
const forDayCnTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return formatNumber(month) + '月' + formatNumber(day) + '日'
}


const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const today = () =>{
  let year,month,day;
  let date = new Date();
  year = date.getFullYear();
  month = formatNumber(date.getMonth() + 1);
  day = formatNumber(date.getDate());
  return `${year}年${month}月${day}日`;
}


module.exports = {
  formatTime: formatTime,
  forDayTime:forDayTime,
  forDayCnTime: forDayCnTime,
  today:today
}
