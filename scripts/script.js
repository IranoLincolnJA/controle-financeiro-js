// Transactions
const transactionUL = document.querySelector("#transactions");
const incomeDisplay = document.querySelector("#income");
const outcomeDispaly = document.querySelector("#outcome");
const balanceDisplay = document.querySelector("#balance");

// Form
const form = document.querySelector('#form');
const inputTransactionName = document.querySelector('#text');
const inputTransactionAmount = document.querySelector('#amount');

const localStorageTransactions = JSON.parse(localStorage
  .getItem('transactions'))

let transactions = localStorage
  .getItem('transactions') !== null ? localStorageTransactions : []

const removeTransaction = ID => {
  transactions = transactions.filter(transaction => transaction.id !== ID)

  updateLocalStorage()
  init()
}

const addTransactionsIntoDOM = ({ amount, name, id }) => {
  const operator = amount < 0 ? '-' : '+'
  const cssClass = amount < 0 ? 'minus' : 'plus'
  const amountWithoutOperator = Math.abs(amount)

  const li = document.createElement('li')
  li.classList.add(cssClass)
  li.innerHTML = `
    ${name} 
    <span>${operator} R$ ${amountWithoutOperator}</span>
    <button class="delete-btn" onClick="removeTransaction(${id})">x</button>
  `

  transactionUL.append(li)
}

const getExpenses = transactionAmounts => Math.abs(transactionAmounts
  .filter(value => value < 0)
  .reduce((accumulator, value) => accumulator + value, 0)
).toFixed(2)

const getIncome = transactionAmounts => transactionAmounts
  .filter(value => value > 0)
  .reduce((accumulator, value) => accumulator + value, 0)
  .toFixed(2)

const getTotal = transactionAmounts => transactionAmounts
  .reduce((accumulator, transaction) => accumulator + transaction, 0)
  .toFixed(2)

const updateBalanceValues = () => {
  const transactionAmounts = transactions.map(({ amount }) => amount)

  const total = getTotal(transactionAmounts)
  const income = getIncome(transactionAmounts)
  const outcome = getExpenses(transactionAmounts)
  
  balanceDisplay.textContent = `R$ ${total}`
  incomeDisplay.textContent = `R$ ${income}`
  outcomeDispaly.textContent = `R$ ${outcome}`
}

const init = () => {
  transactionUL.innerHTML = ''
  transactions.forEach(addTransactionsIntoDOM)
  updateBalanceValues()
}

init()

const updateLocalStorage = () => {
  localStorage.setItem('transactions', JSON.stringify(transactions))
}

const generateID = () => Math.round(Math.random() * 10000)

const addToTransactionsArray = (transactionName, transactionAmount) => {
  transactions.push({ 
    id: generateID(), 
    name: transactionName, 
    amount: Number(transactionAmount)
  })
}

const cleanInputs = () => {
  inputTransactionName.value = ''
  inputTransactionAmount.value = ''
}

const handleFormSubmit = event => {
  event.preventDefault();

  const transactionName = inputTransactionName.value.trim()
  const transactionAmount = inputTransactionAmount.value.trim()
  const isSomeInputempty = transactionName === '' || transactionAmount === ''
  
  if (isSomeInputempty) {
    alert('Por favor, preencha tanto o nome quanto o valor da transação')
    return
  }

  addToTransactionsArray(transactionName, transactionAmount)  
  init()
  updateLocalStorage()
  cleanInputs()
}

form.addEventListener('submit', handleFormSubmit)