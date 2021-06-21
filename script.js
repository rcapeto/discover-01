const Utils = {
   formatCurrency(value) {
      return new Intl.NumberFormat('pt-BR', { currency: 'BRL', style: 'currency'} ).format(value)
   },
   formatAmount(value) {
      return value.toLocaleString('pt-BR', {
         currency: 'BRL',
         style: 'currency'
      });
   },
   formatDate(value) {
      const dateValue = value.split('-');
      const [year, month, day] = dateValue;
      return `${day}/${month}/${year}`;
   }
}

const Modal = {
   element: document.querySelector('.modal-overlay'),
   open() {
      this.element.classList.add('active');
   },
   close() {
      this.element.classList.remove('active');
   }
}

document.querySelector('.button-cancel').addEventListener('click', Modal.close.bind(Modal));
document.querySelector('.button.new').addEventListener('click', Modal.open.bind(Modal));


const StorageLocal = {
   get() {
      return JSON.parse(localStorage.getItem('dev.finances:transactions')) || [];
   },
   set(transactions) {
      localStorage.setItem('dev.finances:transactions', JSON.stringify(transactions));
   },
}

const Transaction = {
   all: StorageLocal.get(),

   add(transaction) {
      Transaction.all.push(transaction);
      App.reload();
   },
   remove(id) {
      const indexTransaction = Transaction.all.findIndex(tran => tran.id === id);
      if(indexTransaction) {
         Transaction.all.splice(indexTransaction, 1);
      }
      console.log('Apagado com sucesso!');
      App.reload();
   },
   incomes() {
     let total = 0;

     Transaction.all.forEach(transaction => {
        if(transaction.amount > 0) total += transaction.amount;
     });

     return Utils.formatCurrency(total);
   },
   expences() {
      let total = 0;

      Transaction.all.forEach(transaction => {
         if(Number(transaction.amount) < 0) total += Number(transaction.amount);
      });

      return Utils.formatCurrency(total);
   },
   total() {
      let total = 0;

      Transaction.all.forEach(transaction => total += Number(transaction.amount));

      return Utils.formatCurrency(total);
   },
}

const DOM = {
   transactionsContainer: document.querySelector('#data-table tbody'),
   addTransaction(transaction) {
      const tr = document.createElement('tr');

      tr.setAttribute('data-id', transaction.id);

      tr.innerHTML = DOM.innerHTMLTransaction(transaction);

      tr.querySelector('img').addEventListener('click', DOM.removeTransaction);

      DOM.transactionsContainer.insertAdjacentElement('beforeend', tr);
   },
   removeTransaction() {
      const tr = this.closest('tr');
      
      if(!tr) return;

      const { id } = tr.dataset;

      Transaction.remove(id);
   },
   innerHTMLTransaction(transaction) {
      const CSSclass = transaction.amount > 0 ? 'income' : 'expense';
      const amount = Utils.formatCurrency(transaction.amount);
      const html = `
         <td class="description">${transaction.description}</td>
         <td class="${CSSclass}">${amount}</td>
         <td class="date">${transaction.date}</td>
         <td>
            <img src="./assets/minus.svg" alt="Remover Transação">
         </td>
      `;

      return html;
   },
   updateBalance() {
      document.getElementById('income-display').innerHTML = Transaction.incomes();
      document.getElementById('expense-display').innerHTML = Transaction.expences();
      document.getElementById('total-display').innerHTML = Transaction.total();
   },
   clearTransaction() {
      DOM.transactionsContainer.innerHTML = '';
   }
}

const Form = {
   inputs: document.querySelectorAll('#form input'),
   getValues() {
      const data = {}

      for(const input of Form.inputs) {
         data[input.name] = input.value;
      }

      return data;
   },
   validateField() {
      const values = Form.getValues();

      for(const name in values) {
         if(values[name].trim() === '') {
            throw new Error('Por favor preencha todos os campos!');
         }
      }  
   }, 
   formatValues() {
      const values = Form.getValues();

      const data = {};

      for(const name in values) {
         if(name === 'amount') {
            data[name] = Utils.formatAmount(values[name]);
         }
         if(name === 'date') {
            data[name] = Utils.formatDate(values[name]);
         } else {
            data[name] = values[name];
         } 
      }
      data['id'] = Date.now();

      return data;
   },
   cleanInputs() {
      for(const input of Form.inputs) {
         input.value = '';
      }
   },
   saveTransaction(transaction) {
      Transaction.add(transaction);
      App.reload();
   },
   submit(e) {
      e.preventDefault();

      try {     
         Form.validateField();
         const transaction = Form.formatValues();
         Form.saveTransaction(transaction);
         Form.cleanInputs();
         Modal.close();

      } catch(err) { 
         ModalError.open();
         ModalError.setMessage(err.message);
      }
   }
}

document.getElementById('form').addEventListener('submit', Form.submit);

const ModalError = {
   element: document.querySelector('.modal-overlay-error'),
   open() {
      this.element.classList.add('active');
   },
   close() {
      this.element.classList.remove('active');
   },
   setMessage(message) {
      this.element.querySelector('p').innerHTML = message;
   }
}

document.querySelector('.btn-error').addEventListener('click', ModalError.close.bind(ModalError));

const App = {
   init() {
      Transaction.all.forEach(transaction => DOM.addTransaction(transaction));
      DOM.updateBalance();
      StorageLocal.set(Transaction.all);
   },
   reload() {
      DOM.clearTransaction();
      App.init();
   },
}

App.init();
