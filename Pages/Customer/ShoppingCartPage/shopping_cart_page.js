
const cartItems = document.querySelectorAll('.cart-item');

const totalAmount = document.querySelector('.amount');

function formatCurrency(value) {
  return `$${value.toFixed(2)}`;
}


function updateItemSubtotal(item) {
  const quantity = item.querySelector('.counter span');

  const subtotal = item.querySelector('.subtotal');

  const unitPrice = Number.parseFloat(item.dataset.unitPrice || '0') || 0;

  const quantity = Number.parseInt(quantity.textContent, 10) || 1;

  const subtotal = unitPrice * quantity;

  subtotal.textContent = formatCurrency(subtotal);
}

function updateCartTotal() {
  let total = 0;
  cartItems.forEach((item) => {

    if (!item.isConnected) {
      return;
    }

    const quantity = item.querySelector('.counter span');
    const unitPrice = Number.parseFloat(item.dataset.unitPrice || '0') || 0;
    const quantity = Number.parseInt(quantity.textContent, 10) || 1;

    // Add this row amount to running total.
    total += unitPrice * quantity;
  });

  totalAmount.textContent = formatCurrency(total);
}

// Attach buttons for each row: decrease, increase, remove.
// item here is each single cart row from the NodeList.
cartItems.forEach((item) => {
  const decreaseBtn = item.querySelector('.counter button:first-child');

  const increaseBtn = item.querySelector('.counter button:last-child');

  const removeBtn = item.querySelector('.remove');

  const quantity = item.querySelector('.counter span');


  decreaseBtn.addEventListener('click', () => {
    const currentQuantity = Number.parseInt(quantity.textContent, 10) || 1;


    if (currentQuantity <= 1) {
      return;
    }

    const nextQuantity = currentQuantity - 1;

    quantity.textContent = String(nextQuantity);

    updateItemSubtotal(item);
    updateCartTotal();
  });

  increaseBtn.addEventListener('click', () => {
    const currentQuantity = Number.parseInt(quantity.textContent, 10) || 1;
    if(currentQuantity >= 20) {
      return;
    }
    const nextQuantity = currentQuantity + 1;

    quantity.textContent = String(nextQuantity);
    updateItemSubtotal(item);
    updateCartTotal();
  });

  removeBtn.addEventListener('click', () => {
    item.remove();
    updateCartTotal();
  });

  updateItemSubtotal(item);
});

updateCartTotal();