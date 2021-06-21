import { Utils } from '../utils.js';
import { DataLocal } from './DataLocal.js';

export class TransitionsController {
   #appController;
   constructor(appController) {
      this.#appController = appController;
      this.all = DataLocal.get() || [];
   }

   add(transition) {
      this.all.push(transition);
   }

   remove(id) {
      const index = this.all.findIndex(transition => transition.id === id);

      if(index >= 0) {
         this.all.splice(index, 1);
         console.log('Apagado com sucesso');
      }

      this.#appController.reload();
   }

   calculateTotal() {
      const total = this.all.reduce((ac, transition) => ac += transition.amount, 0);
      return Utils.formatAmount(total);
   }

   calculateIncome() {
      let income = 0;

      for(const transition of this.all) {
         if(transition.amount > 0) {
            income += transition.amount;
         }
      }
      return Utils.formatAmount(income);
   }

   calculateExpense() {
      let expense = 0;

      for(const transition of this.all) {
         if(transition.amount < 0) {
            expense += transition.amount;
         }
      }
      return Utils.formatAmount(expense);
   }
}