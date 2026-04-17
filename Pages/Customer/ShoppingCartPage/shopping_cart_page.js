document.addEventListener('DOMContentLoaded', () => {
  const cartItems = Array.from(document.querySelectorAll('.cart-item'));
  const totalAmount = document.querySelector('.amount');
  const checkoutLink = document.querySelector('.checkout a.btn.secondary');

  const formatCurrency = (value) => `$${value.toFixed(2)}`;

  const buildCheckoutHref = (subtotal) => {
    const url = new URL('../CheckoutPage/checkout_page.html', window.location.href);
    url.searchParams.set('subtotal', subtotal.toFixed(2));
    return url.toString();
  };

  const getItemElements = (item) => ({
    quantityValue: item.querySelector('.counter span'),
    subtotalValue: item.querySelector('.subtotal'),
    decreaseButton: item.querySelector('.counter button:first-child'),
    increaseButton: item.querySelector('.counter button:last-child'),
    removeButton: item.querySelector('.remove'),
  });

  const getItemQuantity = (item) => {
    const { quantityValue } = getItemElements(item);
    return Number.parseInt(quantityValue.textContent, 10) || 1;
  };

  const getUnitPrice = (item) => Number.parseFloat(item.dataset.unitPrice || '0') || 0;

  const updateItemSubtotal = (item) => {
    const { subtotalValue } = getItemElements(item);
    const quantity = getItemQuantity(item);
    const unitPrice = getUnitPrice(item);
    subtotalValue.textContent = formatCurrency(unitPrice * quantity);
  };

  const updateCartTotal = () => {
    const total = cartItems.reduce((sum, item) => {
      if (!document.body.contains(item)) {
        return sum;
      }

      const quantity = getItemQuantity(item);
      const unitPrice = getUnitPrice(item);
      return sum + (unitPrice * quantity);
    }, 0);

    if (totalAmount) {
      totalAmount.textContent = formatCurrency(total);
    }

    if (checkoutLink) {
      checkoutLink.href = buildCheckoutHref(total);
    }

    return total;
  };

  const refreshCart = () => {
    cartItems.forEach((item) => {
      if (document.body.contains(item)) {
        updateItemSubtotal(item);
      }
    });

    updateCartTotal();
  };

  cartItems.forEach((item) => {
    const { decreaseButton, increaseButton, removeButton } = getItemElements(item);

    decreaseButton.addEventListener('click', () => {
      const quantityValue = getItemElements(item).quantityValue;
      const currentQuantity = getItemQuantity(item);

      if (currentQuantity <= 1) {
        return;
      }

      quantityValue.textContent = String(currentQuantity - 1);
      updateItemSubtotal(item);
      updateCartTotal();
    });

    increaseButton.addEventListener('click', () => {
      const quantityValue = getItemElements(item).quantityValue;
      const currentQuantity = getItemQuantity(item);

      quantityValue.textContent = String(currentQuantity + 1);
      updateItemSubtotal(item);
      updateCartTotal();
    });

    removeButton.addEventListener('click', () => {
      item.remove();
      updateCartTotal();
    });
  });

  refreshCart();
});