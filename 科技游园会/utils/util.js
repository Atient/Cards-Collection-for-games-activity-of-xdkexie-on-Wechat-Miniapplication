var BASE64 = require('/base64.js');

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function getRanNum() {
  var result = "";
    var ranNum = Math.ceil(Math.random() * 25); //生成一个0到25的数字  
    result += String.fromCharCode(65 + ranNum);

    ranNum = Math.ceil(Math.random() * 25); //生成一个0到25的数字
    result += String.fromCharCode(97 + ranNum);

    ranNum = Math.ceil(Math.random() * 25); //生成一个0到25的数字
    result += String.fromCharCode(97 + ranNum);

  
  return result;
}  



//加密
function qrEncrypt(qrData){
    qrData = JSON.stringify(qrData);
    
    var obj_base64 = new BASE64.Base64();
    //base64加密
    var str_base64_encode = obj_base64.encode(qrData);


    str_base64_encode = getRanNum() + str_base64_encode;

    console.log(str_base64_encode);

    return str_base64_encode;
}

//解密
function qrDecrypt(qrString) {
  var obj_base64 = new BASE64.Base64();

  qrString = qrString.substr(3);

  //base64解密
  var str_base64_decode = obj_base64.decode(qrString);

  return str_base64_decode;
}

module.exports = {
  formatTime: formatTime,
  qrEncrypt: qrEncrypt,
  qrDecrypt: qrDecrypt
}
