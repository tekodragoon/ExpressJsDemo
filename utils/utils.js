const errorMessage = (type) => `Creation error. ${type} not provided`;
const capitalize = (str) => str[0].toUpperCase() + str.substring(1);

module.exports = { errorMessage, capitalize };