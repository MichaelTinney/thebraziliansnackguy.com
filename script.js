let cart = JSON.parse(localStorage.getItem('cart')) || [];
let total = cart.reduce((sum, i) => sum + i.price, 0);
updateCart();

function openTab(tabName) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.getElementById(tabName).classList.add('active');
  document.querySelector(`button[onclick="openTab('${tabName}')"]`).classList.add('active');
}

function addToCart(name, price) {
  cart.push({ name, price });
  total += price;
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCart();
}

function removeFromCart(i) {
  total -= cart[i].price;
  cart.splice(i, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCart();
}

function updateCart() {
  const items = document.getElementById('cart-items');
  items.innerHTML = '';
  cart.forEach((item, i) => {
    const li = document.createElement('li');
    li.innerHTML = `${item.name} – $${item.price.toFixed(2)} <span onclick="removeFromCart(${i})" style="float:right;color:red;cursor:pointer;">×</span>`;
    items.appendChild(li);
  });
  document.getElementById('cart-total').textContent = total.toFixed(2);
  document.getElementById('cart-count').textContent = cart.length;
}

function toggleCart() {
  document.getElementId('cart').classList.toggle('open');
}

// PAYPAL SANDBOX
paypal.Buttons({
  createOrder: (data, actions) => {
    if (total === 0) return alert("Cart empty!");
    return actions.order.create({
      purchase_units: [{ amount: { value: total.toFixed(2) } }]
    });
  },
  onApprove: (data, actions) => actions.order.capture().then(d => {
    alert(`Obrigado, ${d.payer.name.given_name}! Order confirmed.`);
    cart = []; total = 0; localStorage.removeItem('cart'); updateCart();
  })
}).render('#paypal-button-container');
