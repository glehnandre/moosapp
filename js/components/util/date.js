const React = require("react-native");

function yyyymmdd(timestamp) {
  var dia = new Date(timestamp).getDate();
  var mes = new Date(timestamp).getMonth()+1;
  var ano = new Date(timestamp).getFullYear();
  var hora = addZero(new Date(timestamp).getHours());
  var minuto = addZero(new Date(timestamp).getMinutes());
  var segundos = addZero(new Date(timestamp).getSeconds());
  return dia +"/" + mes + "/" + ano;
};

function yyyymmddTempo(timestamp) {
  var dia = new Date(timestamp).getDate();
  var mes = new Date(timestamp).getMonth()+1;
  var ano = new Date(timestamp).getFullYear();
  var hora = addZero(new Date(timestamp).getHours());
  var minuto = addZero(new Date(timestamp).getMinutes());
  var segundos = addZero(new Date(timestamp).getSeconds());
  return dia +"/" + mes + "/" + ano +" "+hora+":"+minuto+":"+segundos;
};

function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}


export default { yyyymmdd, yyyymmddTempo }
