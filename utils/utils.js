const errorMessage = (type) => `Creation error. ${type} not provided`;
const capitalize = (str) => str[0].toUpperCase() + str.substring(1);

const addDays = (date, days) => {
  const dateCopy = new Date(date);
  dateCopy.setDate(date.getDate() + days);
  return dateCopy;
}

const today = () => {
  let d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

module.exports = { errorMessage, capitalize, addDays, today };