document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('checkout-form');
  const paymentButtons = Array.from(document.querySelectorAll('.payment-method'));
  const creditCardFields = document.getElementById('credit-card-fields');
  const checkoutMessage = document.getElementById('checkout-message');
  const summaryItems = Array.from(document.querySelectorAll('.summary-item'));
  const subtotalAmount = document.getElementById('summary-subtotal');
  const shippingAmount = document.getElementById('summary-shipping');
  const totalAmount = document.getElementById('summary-total');

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

  const fieldError = (fieldId) => document.querySelector(`[data-error-for="${fieldId}"]`);

  const setError = (field, message) => {
    const errorNode = fieldError(field.id);
    if (errorNode) {
      errorNode.textContent = message;
    }
    field.classList.add('invalid');
  };

  const clearError = (field) => {
    const errorNode = fieldError(field.id);
    if (errorNode) {
      errorNode.textContent = '';
    }
    field.classList.remove('invalid');
  };

  const readPaymentMethodFromQuery = () => {
    const params = new URLSearchParams(window.location.search);
    const payment = params.get('payment');
    return payment === 'credit-card' ? 'credit-card' : 'cash';
  };

  const readSubtotalFromQuery = () => {
    const params = new URLSearchParams(window.location.search);
    const subtotal = Number.parseFloat(params.get('subtotal') || '');
    return Number.isFinite(subtotal) ? subtotal : null;
  };

  const formatCurrency = (value) => `$${value.toFixed(2)}`;

  const calculateSummarySubtotal = () => {
    const querySubtotal = readSubtotalFromQuery();
    if (querySubtotal !== null) {
      return querySubtotal;
    }

    return summaryItems.reduce((sum, item) => {
      const unitPrice = Number.parseFloat(item.dataset.unitPrice || '0') || 0;
      const quantity = Number.parseInt(item.dataset.quantity || '1', 10) || 1;
      return sum + (unitPrice * quantity);
    }, 0);
  };

  const calculateShipping = (subtotal) => (subtotal >= 200 ? 0 : 12);

  const updateSummaryPricing = () => {
    const subtotal = calculateSummarySubtotal();
    const shipping = calculateShipping(subtotal);
    const total = subtotal + shipping;

    if (subtotalAmount) {
      subtotalAmount.textContent = formatCurrency(subtotal);
    }

    if (shippingAmount) {
      shippingAmount.textContent = formatCurrency(shipping);
    }

    if (totalAmount) {
      totalAmount.textContent = formatCurrency(total);
    }

    summaryItems.forEach((item) => {
      const lineTotal = (Number.parseFloat(item.dataset.unitPrice || '0') || 0) * (Number.parseInt(item.dataset.quantity || '1', 10) || 1);
      const lineTotalNode = item.querySelector('.summary-line-total');

      if (lineTotalNode) {
        lineTotalNode.textContent = formatCurrency(lineTotal);
      }
    });

    return { subtotal, shipping, total };
  };

  const setPaymentMethod = (method) => {
    paymentButtons.forEach((button) => {
      const isActive = button.dataset.paymentMethod === method;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });

    const isCreditCard = method === 'credit-card';
    creditCardFields.hidden = !isCreditCard;

    ['cardHolderName', 'cardNumber', 'expiryDate', 'cvv'].forEach((fieldName) => {
      fields[fieldName].required = isCreditCard;
      if (!isCreditCard) {
        clearError(fields[fieldName]);
        fields[fieldName].value = '';
      }
    });

    const url = new URL(window.location.href);
    url.searchParams.set('payment', method);
    window.history.replaceState({}, '', url);
  };

  const validateField = (field, validator) => {
    const value = field.value.trim();
    const message = validator(value);

    if (message) {
      setError(field, message);
      return false;
    }

    clearError(field);
    return true;
  };

  const validationByFieldId = {
    'first-name': (value) => (!value ? 'First name is required.' : ''),
    'last-name': (value) => (!value ? 'Last name is required.' : ''),
    email: (value) => (!value ? 'Email is required.' : (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Enter a valid email address.' : '')),
    phone: (value) => (!value ? 'Phone number is required.' : (!/^[0-9+()\-\s]{7,}$/.test(value) ? 'Enter a valid phone number.' : '')),
    country: (value) => (!value ? 'Select a country.' : ''),
    region: (value) => (!value ? 'Region/state is required.' : ''),
    city: (value) => (!value ? 'City is required.' : ''),
    'zip-code': (value) => (!value ? 'Zip code is required.' : (!/^[A-Za-z0-9\-\s]{3,10}$/.test(value) ? 'Enter a valid zip code.' : '')),
    address: (value) => (!value ? 'Address is required.' : ''),
    'card-holder-name': (value) => (!value ? 'Card holder name is required.' : ''),
    'card-number': (value) => (!value ? 'Card number is required.' : (!/^\d{13,19}$/.test(value.replace(/\s+/g, '')) ? 'Enter a valid card number.' : '')),
    'expiry-date': (value) => (!value ? 'Expiry date is required.' : (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(value) ? 'Use MM/YY format.' : '')),
    cvv: (value) => (!value ? 'CVV is required.' : (!/^\d{3,4}$/.test(value) ? 'Enter a valid CVV.' : '')),
  };

  paymentButtons.forEach((button) => {
    button.addEventListener('click', () => {
      setPaymentMethod(button.dataset.paymentMethod);
    });
  });

  Object.values(fields).forEach((field) => {
    if (!field) {
      return;
    }

    field.addEventListener('input', () => clearError(field));
    field.addEventListener('blur', () => {
      const validator = validationByFieldId[field.id];
      if (validator) {
        validateField(field, validator);
      }
    });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const currentPaymentMethod = paymentButtons.find((button) => button.classList.contains('active'))?.dataset.paymentMethod || 'cash';
    const requiredFields = [
      fields.firstName,
      fields.lastName,
      fields.email,
      fields.phone,
      fields.country,
      fields.region,
      fields.city,
      fields.zipCode,
      fields.address,
    ];

    if (currentPaymentMethod === 'credit-card') {
      requiredFields.push(fields.cardHolderName, fields.cardNumber, fields.expiryDate, fields.cvv);
    }

    const isValid = requiredFields.every((field) => {
      const validator = validationByFieldId[field.id];
      return validator ? validateField(field, validator) : true;
    });

    if (!isValid) {
      if (checkoutMessage) {
        checkoutMessage.textContent = '';
      }
      return;
    }

    const params = new URLSearchParams(window.location.search);
    params.set('payment', currentPaymentMethod);
    const pricing = updateSummaryPricing();
    params.set('subtotal', pricing.subtotal.toFixed(2));
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);

    if (checkoutMessage) {
      checkoutMessage.textContent = `Checkout validated using ${currentPaymentMethod === 'credit-card' ? 'credit card' : 'cash on delivery'} for ${formatCurrency(pricing.total)}.`;
    }
  });

  setPaymentMethod(readPaymentMethodFromQuery());
  updateSummaryPricing();
});