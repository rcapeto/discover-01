export class ModalError {
   #containerEl;

   constructor(containerEl) {
      this.#containerEl = document.querySelector(containerEl);
      this.#handleEvents();
   }

   openModal() {
      this.#containerEl.classList.add('active');
   }

   closeModal() {
      this.#containerEl.classList.remove('active');
   }

   setMessage(message) {
      this.#containerEl.querySelector('p').innerHTML = message;
   }
   
   #handleEvents() {
      this.#containerEl.querySelector('button').addEventListener('click', this.closeModal.bind(this));
   }
}