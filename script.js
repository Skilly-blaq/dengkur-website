/* =========================
   CART (LOCAL STORAGE)
========================= */

let cart = JSON.parse(localStorage.getItem("cart")) || [];

/* ADD TO CART */
function addToCart(price, name) {

  cart.push({ price, name });

  localStorage.setItem("cart", JSON.stringify(cart));

  updateCart();
  openCart();
}

/* UPDATE CART UI */
function updateCart() {
  let list = document.getElementById("cart-items");
  let totalEl = document.getElementById("total");
  let countEl = document.getElementById("cart-count");

  if (!list || !totalEl) return;

  list.innerHTML = "";
  let sum = 0;

  cart.forEach((item, index) => {
    list.innerHTML += `
      <li>
        ${item.name} - $${item.price}
        <button onclick="removeItem(${index})">❌</button>
      </li>
    `;
    sum += item.price;
  });

  totalEl.innerText = sum;
  if (countEl) countEl.innerText = cart.length;

  localStorage.setItem("cart", JSON.stringify(cart));
}

/* REMOVE ITEM */
function removeItem(index) {
  cart.splice(index, 1);
  updateCart();
}

/* CART OPEN / CLOSE */
function openCart() {
  document.querySelector(".cart").classList.add("active");
}

function closeCart() {
  document.querySelector(".cart").classList.remove("active");
}

/* =========================
   SEARCH
========================= */
function searchProducts() {
  let value = document.getElementById("searchInput").value.toLowerCase();
  let products = document.querySelectorAll(".product-card");

  products.forEach(p => {
    let name = p.querySelector("h3").innerText.toLowerCase();
    p.style.display = name.includes(value) ? "block" : "none";
  });
}

/* =========================
   CATEGORY FILTER
========================= */
document.getElementById("categoryFilter")?.addEventListener("change", function () {
  let value = this.value;
  let products = document.querySelectorAll(".product-card");

  products.forEach(p => {
    if (value === "all" || p.dataset.category === value) {
      p.style.display = "block";
    } else {
      p.style.display = "none";
    }
  });
});

/* =========================
   CHECKOUT → PAYSTACK
========================= */
function checkout() {
  if (cart.length === 0) {
    alert("Your cart is empty");
    return;
  }

  let totalKES = 0;
  cart.forEach(item => {
    totalKES += item.price;
  });

  payWithPaystack(totalKES);
}

/* =========================
   PAYSTACK PAYMENT
========================= */
function payWithPaystack(amountKES) {
  let handler = PaystackPop.setup({
    key: "pk_test_562ba97a4f998b5ed809617c119661a27bec106c",
    email: "customer@dengkur.com",
    amount: amountKES * 100,
    currency: "KES",
    channels: ["card", "mobile_money"],

    callback: function (response) {
      alert("Payment successful! Reference: " + response.reference);

      // clear cart AFTER payment
      cart = [];
      localStorage.removeItem("cart");
      updateCart();
      closeCart();

      showSuccessPage();
    },

    onClose: function () {
      alert("Payment cancelled");
    }
  });

  handler.openIframe();
}

/* INITIAL LOAD */
updateCart();

function showSuccessPage() {
  document.querySelector("header").style.display = "none";
  document.querySelectorAll("section").forEach(sec => sec.style.display = "none");

  document.getElementById("payment-success").style.display = "block";
}

function goHome() {
  location.reload(); // resets site to normal state
}