const selector = (element) => {
  return document.querySelector(element);
};
const selectorAll = (element) => {
  return document.querySelectorAll(element);
};
let modalQt = 1;
let modal = selector('.pizzaWindowArea');
pizzaJson.map((item, index) => {
  let pizzaItem = selector('.models .pizza-item').cloneNode(true);
  pizzaItem.setAttribute('data-key', index);
  pizzaItem.querySelector('.pizza-item--img img').src = item.img;
  pizzaItem.querySelector('.pizza-item--desc').innerText = item.description;
  pizzaItem.querySelector('.pizza-item--name').innerText = item.name;
  pizzaItem.querySelector(
    '.pizza-item--price'
  ).innerText = `$ ${item.price.toFixed(2)}`;
  //
  pizzaItem.querySelector('a').addEventListener('click', (event) => {
    event.preventDefault();
    let key = event.target.closest('.pizza-item').getAttribute('data-key');
    selector('.pizzaBig img').src = item.img;
    selector('.pizzaInfo h1').innerText = item.name;
    selector('.pizzaInfo--desc').innerText = item.description;
    selector('.pizzaInfo--actualPrice').innerText = `$${item.price.toFixed(2)}`;
    selector('.pizzaInfo--size.selected').classList.remove('selected');
    selectorAll('.pizzaInfo--size').forEach((size, index) => {
      if (index == 2) size.classList.add('selected');
      size.querySelector('span').innerText = item.sizes[index];
    });
    {
      selector('.pizzaInfo--qt').innerText = modalQt;
    }
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

{
  selector('.pizzaInfo--qtmais').addEventListener('click', () => {
    if (modalQt < 1) {
      modalQt = 1;
    }
    modalQt++;
    selector('.pizzaInfo--qt').innerText = modalQt;
  });
  selector('.pizzaInfo--qtmenos').addEventListener('click', () => {
    if (modalQt > 1) {
      modalQt--;
      selector('.pizzaInfo--qt').innerText = modalQt;
    }
  });
}
{
  selectorAll('.pizzaInfo--size').forEach((size, index) => {
    size.addEventListener('click', (event) => {
      selector('.pizzaInfo--size.selected').classList.remove('selected');
      size.classList.add('selected');
    });
  });
}
