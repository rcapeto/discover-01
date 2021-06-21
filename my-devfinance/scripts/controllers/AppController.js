import { DOMView } from '../view/DOMView.js';
import { TransitionsController } from './TransitionsController.js';
import { ModalController } from './ModalController.js';
import { DataLocal } from './DataLocal.js';
import { FormController } from './FomController.js';
import { ModalError } from './ModalError.js';

export class AppController {
   #transitionsController;
   #domView;
   #modalController;
   #modalError;
   #formController;

   constructor() {
      this.#transitionsController = new TransitionsController(this);
      this.#domView = new DOMView('#data-table tbody', this.#transitionsController);
      this.#modalController = new ModalController('.modal-overlay');
      this.#modalError = new ModalError('.modal-overlay-error');
      this.#formController = new FormController(
         '#form', 
         this.#transitionsController, 
         this,
         this.#modalController,
         this.#modalError
      );
   }

   init() {
      this.#domView.cleanDOM();
      this.#domView.setDisplays();
      this.#transitionsController.all.forEach(transaction => this.#domView.renderTransition(transaction));
   }

   reload() {
      DataLocal.set(this.#transitionsController.all);
      this.init();
   }
}