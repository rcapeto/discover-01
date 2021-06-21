export class ModalController {
   #modalEl;

   constructor(modalEl) {
      this.#modalEl = document.querySelector(modalEl);
      this.#handleEvents();
   }

   #handleEvents() {
      document.querySelector('.button-transaction').addEventListener('click', this.openModal.bind(this));
      document.querySelector('.btn.cancel').addEventListener('click', this.closeModal.bind(this));
   }

   openModal() {
      this.#modalEl.classList.add('active');
   }
   
   closeModal() {
      this.#modalEl.classList.remove('active');
   }
}