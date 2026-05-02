let totalPrice = document.querySelector('.amount');

function removeNum(element) {
  let number = element.parentNode;
  number = number.querySelector("#numberOfItems");
  if(number.innerText > 0){
    number.innerText --;
  }
  calculateSubAmmount(element);
  calculateAmmount(element.parentNode.parentNode);
}

function addNum(element){
  let number = element.parentNode;
  number = number.querySelector("#numberOfItems");
  if(number.innerText < 20){
    number.innerText ++;
  }

  calculateSubAmmount(element);
  calculateAmmount(element.parentNode.parentNode);
}

//remove section
function remove(element){
  const main = document.querySelector('main');

  main.removeChild(element.parentNode);

  calculateAmmount(element);

}

//calculate amount section

function calculateSubAmmount(element){
  let totalPrice = 0;
  const numberOfElement = element.parentNode.querySelector('#numberOfItems');
  const price = element.parentNode.parentNode.parentNode.querySelector('.price');
  const subTotal = element.parentNode.parentNode.parentNode.querySelector('.subtotal');

  totalPrice = parseFloat(price.textContent.replace("$" , "")) * parseFloat(numberOfElement.innerText);

  subTotal.innerText = "$" + totalPrice;
}


function calculateAmmount(){
  const items = document.querySelectorAll('.cart-item');
  const itemsArray = Array.from(items);
  let total = 0;
  itemsArray.forEach(item  =>{
    console.log(item);
    const subTotal = item.querySelector('.subtotal');
    
    total += parseFloat(subTotal.textContent.replace("$" , ""));
    
  });
  totalPrice.innerText ='$' + total;
}


