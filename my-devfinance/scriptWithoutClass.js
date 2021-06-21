const utils = {
   formatAmout(value) {
      return new Intl.NumberFormat('pt-BR', {
         currency: 'BRL',
         style: 'currency'
      }).format(Number(value));
   },
   formatDate(date) {
      const dateArr = date.split('-');
      const [year, month, day] = dateArr;
      return `${day}/${month}/${year}`;
   }
}

const modal = {
   element: document.querySelector('.modal-overlay'),
   open() {
      this.element.classList.add('active');
   },
   close() {
      this.element.classList.remove('active');
   }
}

document.querySelector('.btn.cancel').addEventListener('click', modal.close.bind(modal));
document.querySelector('.button-transaction').addEventListener('click', modal.open.bind(modal));

const dataLocal = {
   get() {
      return JSON.parse(localStorage.getItem('data-application-transactions')) || [];
   },
   set(transactions) {
      localStorage.setItem('data-application-transactions', JSON.stringify(transactions));
   }
}

const transactions = {
   all: dataLocal.get(),
   add(transaction) {
      transactions.all.push(transaction)
   },
   remove(id) {
      const index = transactions.all.findIndex(transaction => transaction.id === id);
      
      if(index !== -1) transactions.all.splice(index, 1);

      console.log('Deletado com sucesso');

      App.reload();
   },
   total() {
      return utils.formatAmout(transactions.all.reduce((ac, trans) => ac += trans.amount, 0));
   },
   incomes() {
      let result = 0;

      transactions.all.forEach(transaction => {
         if(transaction.amount > 0) result += transaction.amount;
      });

      return utils.formatAmout(result);
   },
   expenses() {
      let result = 0;

      transactions.all.forEach(transaction => {
         if(transaction.amount < 0) result += transaction.amount;
      });

      return utils.formatAmout(result);
   }
}

const dom = {
   container: document.querySelector('#data-table tbody'),

   renderTransaction(transaction) {
      const tr = document.createElement('tr');
      tr.setAttribute('data-id', transaction.id);
      tr.innerHTML = dom.getContent(transaction);
      tr.querySelector('img').addEventListener('click', () => transactions.remove(transaction.id));
      dom.container.insertAdjacentElement('beforeend', tr);
   },
   getContent(transaction) {
      const className = transaction.amount > 0 ? 'income' : 'expense';
      const amount = utils.formatAmout(transaction.amount);
      
      return `
         <td class="description">${transaction.description}</td>
         <td class="${className}">${amount}</td>
         <td class="date">${transaction.date}</td>
         <td><img src="./assets/minus.svg" alt="Deletar"></td>
      `;
   },
   calculateTransactions() {
      document.querySelector('#income-data').innerHTML = transactions.incomes();
      document.querySelector('#expense-data').innerHTML = transactions.expenses();
      document.querySelector('#total-data').innerHTML = transactions.total();
   },
   cleanDom() {
      dom.container.innerHTML = '';
   }
}

const form = {
   element: document.getElementById('form'),
   submit(event) {
      event.preventDefault();
      
      try {
         form.checkEmptyFields();
         const formatedValues = form.formatValues();
         transactions.add(formatedValues);
         modal.close();
         form.cleanAllFields();
         App.reload();
      } catch(err) {
         console.error(err);
         window.alert(err.message);
      }
   },
   checkEmptyFields() {
      const inputs = form.element.querySelectorAll('input');
      
      for(const input of inputs){
         if(!input.value) throw new Error('Por favor preencha todos os campos!');
      }
   },
   formatValues() {
      const values = {};
      const inputs = form.element.querySelectorAll('input');
      
      for(const input of inputs){
         if(input.name === 'amount') 
            values[input.name] = +input.value;
        
         else if(input.name === 'date')
            values[input.name] = utils.formatDate(input.value);
         else
            values[input.name] = input.value;
      }
      values['id'] = Date.now();

      return values;
   },
   cleanAllFields() {
      const inputs = form.element.querySelectorAll('input');
      
      for(const input of inputs){
         input.value = '';
      }
   },
   initEvent() {
      form.element.addEventListener('submit', form.submit);
   }
}

const App = {
   init() {
      dom.cleanDom();
      transactions.all.forEach(transaction => dom.renderTransaction(transaction));
      dom.calculateTransactions();
   },
   reload() {
      dataLocal.set(transactions.all);
      App.init();
   }
}

form.initEvent();
App.init();