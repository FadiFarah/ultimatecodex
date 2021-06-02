function getCurrentDate(){

const months = {
  0: 'January',
  1: 'February',
  2: 'March',
  3: 'April',
  4: 'May',
  5: 'June',
  6: 'July',
  7: 'August',
  8: 'September',
  9: 'October',
  10: 'November',
  11: 'December'
}
const d = new Date()
const year = d.getFullYear() // 2019
const date = d.getDate()
const monthIndex = d.getMonth()
const monthName = months[monthIndex]
return monthName+" "+date+", "+year;
}
module.exports = getCurrentDate();
