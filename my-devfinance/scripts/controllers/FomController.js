import { Utils } from '../utils.js';

export class FormController {
   #formEl;
   #transitions;
   #appController;
   #modalController;
   #modalError;

   constructor(formEl, transactions, appController, modal, modalError) {
      this.#formEl = document.querySelector(formEl);
      this.#transitions = transactions;
      this.#appController = appController;
      this.#modalController = modal;
      this.#modalError = modalError;
      this.#handleEvent();
   }

   #handleEvent() {
      this.#formEl.addEventListener('submit', this.#submit.bind(this));
   }

   #submit(event) {
      event.preventDefault();

      try {
         this.#checkEmptyFields();
         const transition = this.#formatValues();
         this.#transitions.add(transition);
         this.#modalController.closeModal();
         this.#cleanAllFields();
         this.#appController.reload();
      
      } catch(error) {
         this.#modalError.setMessage(error.message);
         this.#modalError.openModal();
      }
   }

   #formatValues() {
      const formData = [...new FormData(this.#formEl)];
      const values = Object.fromEntries(formData);

      for(const name in values) {
         if(name === 'date') values[name] = Utils.formatDate(values[name]);
         if(name === 'amount') values[name] = +values[name];
      }

      return values;
   }

   #checkEmptyFields() {
      const inputs = this.#formEl.querySelectorAll('input');

      for(const input of inputs) {
         if(!input.value) throw new Error('Por favor preencha todos os dados');
      }
   }

   #cleanAllFields() {
      const inputs = this.#formEl.querySelectorAll('input');

      for(const input of inputs) {
         input.value = '';
      }
   }
}