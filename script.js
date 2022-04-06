const selector = (element) => {
  return document.querySelector(element);
};
const selectorAll = (element) => {
  return document.querySelectorAll(element);
};
let modalQt = 1;
let modal = selector('.pizzaWindowArea');
let price;
pizzaJson.map((item, index) => {
  let pizzaItem = selector('.models .pizza-item').cloneNode(true);
  pizzaItem.setAttribute('data-key', index);
  pizzaItem.querySelector('.pizza-item--img img').src = item.img;
  pizzaItem.querySelector('.pizza-item--desc').innerText = item.description;
  pizzaItem.querySelector('.pizza-item--name').innerText = item.name;
  price = item.price;
  pizzaItem.querySelector('.pizza-item--price').innerText = `$ ${price.toFixed(
    2
  )}`;
  pizzaItem.querySelector('a').addEventListener('click', (event) => {
    event.preventDefault();
    let key = event.target.closest('.pizza-item').getAttribute('data-key');
    selector('.pizzaBig img').src = pizzaJson[key].img;
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
          price = (pizzaJson[key].price * 1).toFixed(2);
          selector('.pizzaInfo--actualPrice').innerText = `$${price}`;
        } else {
          price = (pizzaJson[key].price * 1.3).toFixed(2);
          selector('.pizzaInfo--actualPrice').innerText = `$${price}`;
        }
      });
    });
    selector('.pizzaInfo--qt').innerText = modalQt = 1;
    modal.style.display = 'flex';
    setTimeout(() => {
      modal.style.opacity = 1;
    }, 100);
  });
  selector('.pizza-area').append(pizzaItem);
});

// Modal window events
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
