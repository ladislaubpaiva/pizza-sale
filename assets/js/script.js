let modalQt = 1,
  modalKey = 0,
  price = 0;
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
  ).innerText = `$ ${item.price.toFixed(2)}`;
  pizzaItem.querySelector('a').addEventListener('click', (event) => {
    event.preventDefault();
    let key = event.target.closest('.pizza-item').getAttribute('data-key');
    modalQt = 1;
    modalKey = key;
    selector('.pizzaBig img').src = pizzaJson[key].img;
    selector('.pizzaBig img').setAttribute('draggable', 'false');
    selector('.pizzaInfo h1').innerText = pizzaJson[key].name;
    selector('.pizzaInfo--desc').innerText = pizzaJson[key].description;
    price = pizzaJson[key].price;
    selector('.pizzaInfo--actualPrice').innerText = `$${price.toFixed(2)}`;
    selector('.pizzaInfo--size.selected').classList.remove('selected');
    selectorAll('.pizzaInfo--size').forEach((size, index) => {
      if (index == 1) size.classList.add('selected');
      size.querySelector('span').innerText = item.sizes[index];
      size.addEventListener('click', () => {
        selector('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
        if (index == 0) {
          price = (pizzaJson[key].price * 0.7).toFixed(2);
          selector('.pizzaInfo--actualPrice').innerText = `$${price}`;
        } else if (index == 1) {
          price = pizzaJson[key].price.toFixed(2);
          selector('.pizzaInfo--actualPrice').innerText = `$${price}`;
        } else {
          price = (pizzaJson[key].price * 1.3).toFixed(2);
          selector('.pizzaInfo--actualPrice').innerText = `$${price}`;
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
function updateCart() {
  if (cart.length > 0) {
    selector('aside').classList.add('show');
    selector('.cart').innerText = '';
    for (let i in cart) {
      let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);
      let cartItem = selector('.models .cart--item').cloneNode(true);
      cartItem.querySelector('img').src = pizzaItem.img;
      // console.log(pizzaSizeName);
      let pizzaSizeName;
      switch (Number(cart[i].size)) {
        case 0:
          pizzaSizeName = 'S';
          break;
        case 1:
          pizzaSizeName = 'M';
          break;
        case 2:
          pizzaSizeName = 'B';
          break;
      }
      let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;
      cartItem.querySelector('.cart--item-name').innerText = pizzaName;
      cartItem.querySelector('.cart--item--qt').innerText = cart[i].qt;
      selector('.cart').append(cartItem);
    }
  } else {
    selector('aside').classList.remove('show');
  }
}
