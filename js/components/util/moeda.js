export function getValorEmReal(valor){
   if (typeof valor != 'number') return false; // para garantir que o input é um numero
   valor = ('' + valor).replace(',', '.');
   valor = ('' + valor).split('.');
   var parteInteira = valor[0] + '';
   var parteDecimal = valor[1];

   // tratar a parte inteira
   var rx = /(\d+)(\d{3})/;
   parteInteira = parteInteira.replace(/^\d+/, function (w) {
       while (rx.test(w)) {
           w = w.replace(rx, '$1.$2');
       }
       return w;
   });

   // tratar a parte decimal
   var formatoDecimal = 2;

   if (parteDecimal) parteDecimal = parteDecimal.slice(0, formatoDecimal);
   else if (!parteDecimal && formatoDecimal) {
       parteDecimal = '';
       while (parteDecimal.length < formatoDecimal) {
           parteDecimal = '0' + parteDecimal;
       }
   }
   return parteDecimal ? [parteInteira, parteDecimal].join(',') : parteInteira;
}
