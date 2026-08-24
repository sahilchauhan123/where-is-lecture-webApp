const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const todayName = days[new Date().getDay()];
const date = new Date();
const day = date.getDate();
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const month = months[date.getMonth()];
const year = date.getFullYear();

export const todayTime = {
  todayName,
  date,
  day,
  month,
  year,
};
