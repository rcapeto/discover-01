export class DataLocal {
   static get() {
      return JSON.parse(localStorage.getItem('data:dev.finance'));
   }

   static set(transactions) {
      localStorage.setItem('data:dev.finance', JSON.stringify(transactions));
   }
}