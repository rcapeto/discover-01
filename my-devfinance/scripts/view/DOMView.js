import { Utils } from '../utils.js';

export class DOMView {
   #containerElement;
   #transitions;

   constructor(containerEl, transitions) {
      this.#containerElement = document.querySelector(containerEl);
      this.#transitions = transitions;
   }

   renderTransition(transition) {
      const tr = document.createElement('tr');
      tr.innerHTML = this.getDisplay(transition);
      tr.setAttribute('data-id', transition.id);
      tr.querySelector('img').addEventListener('click', () => this.#transitions.remove(transition.id));
      this.#containerElement.insertAdjacentElement('beforeend', tr);
   }

   getDisplay(transition) {
      const className = transition.amount > 0 ? 'income': 'expense';
      const amount = Utils.formatAmount(transition.amount);
      return `
         <td class="description">${transition.description}</td>
         <td class="${className}">${amount}</td>
         <td class="date">${transition.date}</td>
         <td><img src="./assets/minus.svg" alt="Deletar"></td>
      `;
   }

   setDisplays() {
      document.querySelector('#income-data').innerHTML = this.#transitions.calculateIncome();
      document.querySelector('#expense-data').innerHTML = this.#transitions.calculateExpense();
      document.querySelector('#total-data').innerHTML = this.#transitions.calculateTotal();
   }

   cleanDOM() {
      this.#containerElement.innerHTML = '';
   }
}