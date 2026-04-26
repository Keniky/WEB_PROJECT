// Simple checkout validation with short regex checks.
const form = document.getElementById('checkout-form');
const checkoutMessage = document.getElementById('checkout-message');
const paymentButtons = document.querySelectorAll('.payment-method');
const creditCardFields = document.getElementById('credit-card-fields');

const fields = {
  firstName: document.getElementById('first-name'),
  lastName: document.getElementById('last-name'),
  email: document.getElementById('email'),
  phone: document.getElementById('phone'),
  country: document.getElementById('country'),
  region: document.getElementById('region'),
  city: document.getElementById('city'),
  zipCode: document.getElementById('zip-code'),
  address: document.getElementById('address'),
  cardHolderName: document.getElementById('card-holder-name'),
  cardNumber: document.getElementById('card-number'),
  expiryDate: document.getElementById('expiry-date'),
  cvv: document.getElementById('cvv'),
};

function errorEl(field) {
  return document.querySelector(`[data-error-for="${field.id}"]`);
}

function setError(field, message) {
  const el = errorEl(field);
  if (el) el.textContent = message;
  field.classList.add('invalid');
}

function clearError(field) {
  const el = errorEl(field);
  if (el) el.textContent = '';
  field.classList.remove('invalid');
}

function selectedPayment() {
  for (let i = 0; i < paymentButtons.length; i += 1) {
    if (paymentButtons[i].classList.contains('active')) return paymentButtons[i].dataset.paymentMethod;
  }
  return 'cash';
}

function setPayment(method) {
  for (let i = 0; i < paymentButtons.length; i += 1) {
    const active = paymentButtons[i].dataset.paymentMethod === method;
    paymentButtons[i].classList.toggle('active', active);
    paymentButtons[i].setAttribute('aria-pressed', String(active));
  }
  creditCardFields.hidden = method !== 'credit-card';
}

function check(field, regex, message) {
  if (regex.test(field.value.trim())) {
    clearError(field);
    return true;
  }
  setError(field, message);
  return false;
}

for (let i = 0; i < paymentButtons.length; i += 1) {
  paymentButtons[i].addEventListener('click', () => setPayment(paymentButtons[i].dataset.paymentMethod));
}

Object.values(fields).forEach((field) => {
  field.addEventListener('input', () => clearError(field));
});

form.addEventListener('submit', (event) => {
  event.preventDefault();

  let ok = true;
  ok = check(fields.firstName, /^.{1,}$/, 'First name is required.') && ok;
  ok = check(fields.lastName, /^.{1,}$/, 'Last name is required.') && ok;
  ok = check(fields.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Enter a valid email.') && ok;
  ok = check(fields.phone, /^[0-9+()\-\s]{7,}$/, 'Enter a valid phone number.') && ok;
  ok = check(fields.country, /^.{1,}$/, 'Country is required.') && ok;
  ok = check(fields.region, /^.{1,}$/, 'Region/State is required.') && ok;
  ok = check(fields.city, /^.{1,}$/, 'City is required.') && ok;
  ok = check(fields.zipCode, /^[A-Za-z0-9\-\s]{3,10}$/, 'Enter a valid zip code.') && ok;
  ok = check(fields.address, /^.{1,}$/, 'Address is required.') && ok;

  if (selectedPayment() === 'credit-card') {
    ok = check(fields.cardHolderName, /^.{1,}$/, 'Card holder name is required.') && ok;
    ok = check(fields.cardNumber, /^\d{13,19}$/, 'Card number must be 13-19 digits.') && ok;
    ok = check(fields.expiryDate, /^(0[1-9]|1[0-2])\/\d{2}$/, 'Use MM/YY format.') && ok;
    ok = check(fields.cvv, /^\d{3,4}$/, 'CVV must be 3 or 4 digits.') && ok;
  }

  checkoutMessage.textContent = ok ? 'Form is valid. You can place the order.' : '';
});

setPayment(selectedPayment());