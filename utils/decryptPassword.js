const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");

function decryptPassword({salt, hash, token}, password) {
  const compareToHash = SHA256(salt+password).toString(encBase64);

  if (hash === compareToHash) {
    return token;
  }

  return "Invalid Password";
}

module.exports = decryptPassword;