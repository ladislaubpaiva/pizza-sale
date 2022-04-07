let modalQt = 1,
  modalKey = 0;
let cart = [];
const selector = (element) => {
  return document.querySelector(element);
};
const selectorAll = (element) => {
  return document.querySelectorAll(element);
};

let modal = selector('.pizzaWindowArea');
pizzaJson.map((item, index) => {
  let pizzaItem = selector('.models .pizza-item').cloneNode(true);
  pizzaItem.setAttribute('data-key', index);
  pizzaItem.querySelector('.pizza-item--img img').src = item.img;
  pizzaItem
    .querySelector('.pizza-item--img img')
    .setAttribute('draggable', 'false');
  pizzaItem.querySelector('.pizza-item--desc').innerText = item.description;
  pizzaItem.querySelector('.pizza-item--name').innerText = item.name;
  pizzaItem.querySelector(
    '.pizza-item--price'
  ).innerText = `$ ${item.price[1].toFixed(2)}`;
  pizzaItem.querySelector('a').addEventListener('click', (event) => {
    event.preventDefault();
    let key = event.target.closest('.pizza-item').getAttribute('data-key');
    modalQt = 1;
    modalKey = key;
    selector('.pizzaBig img').src = pizzaJson[key].img;
    selector('.pizzaBig img').setAttribute('draggable', 'false');
    selector('.pizzaInfo h1').innerText = pizzaJson[key].name;
    selector('.pizzaInfo--desc').innerText = pizzaJson[key].description;
    selector('.pizzaInfo--actualPrice').innerText =
      pizzaJson[key].price[1].toFixed(2);
    selector('.pizzaInfo--size.selected').classList.remove('selected');
    selectorAll('.pizzaInfo--size').forEach((size, index) => {
      if (index == 1) size.classList.add('selected');
      size.querySelector('span').innerText = item.sizes[index];
      size.addEventListener('click', () => {
        selector('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
        let sizeSelect = selector('.pizzaInfo--size.selected').getAttribute(
          'data-key'
        );
        switch (Number(sizeSelect)) {
          case 0:
            selector('.pizzaInfo--actualPrice').innerText =
              pizzaJson[key].price[0].toFixed(2);
            break;
          case 1:
            selector('.pizzaInfo--actualPrice').innerText =
              pizzaJson[key].price[1].toFixed(2);
            break;
          case 2:
            selector('.pizzaInfo--actualPrice').innerText =
              pizzaJson[key].price[2].toFixed(2);
            break;
        }
      });
    });
    selector('.pizzaInfo--qt').innerText = modalQt;
    modal.style.display = 'flex';
    setTimeout(() => {
      modal.style.opacity = 1;
    }, 100);
  });
  selector('.pizza-area').append(pizzaItem);
});

// || Modal window events
function closeModal() {
  selector('.pizzaWindowArea').style.opacity = 0;
  setTimeout(() => {
    modal.style.display = 'none';
  }, 500);
}

selectorAll('.pizzaInfo--cancelButton,.pizzaInfo--cancelMobileButton').forEach(
  (item) => {
    item.addEventListener('click', closeModal);
  }
);

selector('.pizzaInfo--qtmais').addEventListener('click', () => {
  modalQt++;
  selector('.pizzaInfo--qt').innerText = modalQt;
});
selector('.pizzaInfo--qtmenos').addEventListener('click', () => {
  if (modalQt > 1) {
    modalQt--;
    selector('.pizzaInfo--qt').innerText = modalQt;
  }
});

// || Cart
selector('.pizzaInfo--addButton').addEventListener('click', () => {
  let size = selector('.pizzaInfo--size.selected').getAttribute('data-key');
  let identifier = pizzaJson[modalKey].id + '@' + size;
  let key = cart.findIndex((item) => item.identifier === identifier);
  if (key > -1) {
    cart[key].qt += modalQt;
  } else {
    cart.push({
      identifier,
      id: pizzaJson[modalKey].id,
      size,
      qt: modalQt,
    });
  }
  updateCart();
  closeModal();
});
selector('.menu-openner').addEventListener('click', () => {
  if (cart.length > 0) {
    selector('aside').style.left = 0;
    updateCart();
  }
});
selector('.menu-closer').addEventListener('click', () => {
  selector('aside').style.left = 100 + 'vw';
  updateCart();
});
function updateCart() {
  selector('.menu-openner span').innerText = cart.length;
  if (cart.length > 0) {
    selector('aside').classList.add('show');
    selector('.cart').innerText = '';
    let subTotal = 0,
      discount = 0,
      total = 0;
    for (let i in cart) {
      let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);
      let cartItem = selector('.models .cart--item').cloneNode(true);
      cartItem.querySelector('img').src = pizzaItem.img;
      let pizzaSizeName;
      let pizzaPrice;
      switch (Number(cart[i].size)) {
        case 0:
          pizzaSizeName = 'S';
          pizzaPrice = pizzaItem.price[0].toFixed(2);
          break;
        case 1:
          pizzaSizeName = 'M';
          pizzaPrice = pizzaItem.price[1].toFixed(2);
          break;
        case 2:
          pizzaSizeName = 'B';
          pizzaPrice = pizzaItem.price[2].toFixed(2);
          break;
      }
      subTotal += pizzaPrice * cart[i].qt;
      let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;
      cartItem.querySelector('.cart--item-name').innerText = pizzaName;
      cartItem.querySelector('.cart--item--qt').innerText = cart[i].qt;
      cartItem
        .querySelector('.cart--item-qtmais')
        .addEventListener('click', () => {
          cart[i].qt++;
          updateCart();
        });
      cartItem
        .querySelector('.cart--item-qtmenos')
        .addEventListener('click', () => {
          if (cart[i].qt > 1) {
            cart[i].qt--;
          } else {
            cart.splice(i, 1);
          }
          updateCart();
        });
      selector('.cart').append(cartItem);
    }
    selector('#promo').addEventListener('keydown', (e) => {
      let promoCode = selector('#promo').value;
      let promo = '';
      promo = promoCode.toUpperCase();
      let key = e.key;
      let priceDiscount = (v) => {
        discount = (subTotal * v).toFixed(2);
        total = (subTotal - discount).toFixed(2);
        selector('span#discount').innerText = `$ ${discount}`;
        selector('span#total').innerText = `$ ${total}`;
      };
      if (key == 'Enter') {
        switch (promo) {
          case 'LADIS':
            priceDiscount(0.05);
            break;
          case 'PAIVA':
            priceDiscount(0.1);
            break;
          case 'ANIME':
            priceDiscount(0.2);
            break;
          default:
            priceDiscount(0);
            alert('Promo codes in browser console');
            break;
        }
      }
    });
    total = (subTotal - discount).toFixed(2);
    subTotal = subTotal.toFixed(2);
    selector('.subtotal span:last-child').innerText = `$ ${subTotal}`;
    selector('span#discount').innerText = `$ ${discount}`;
    selector('span#total').innerText = `$ ${total}`;
  } else {
    selector('aside').classList.remove('show');
    selector('aside').style.left = 100 + 'vw';
  }
}
console.log('PROMO CODES :"LADIS","PAIVA","ANIME"');
