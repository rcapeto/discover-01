export class Utils {
   static formatAmount(value) {
      return new Intl.NumberFormat('pt-BR', {
         style: 'currency',
         currency: 'BRL'
      }).format(+value);
   }
   static formatDate(value) {
      const dateArr = value.split('-');
      const [year, month, day] = dateArr;
      return `${day}/${month}/${year}`;
   }
}