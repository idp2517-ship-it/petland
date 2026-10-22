/* ===== Допоміжні функції ===== */
const $ = (s, r = document) => r.querySelector(s);
const money = n => n.toLocaleString("uk-UA") + " ₴";
const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };

/* ===== Кошик (зберігається в localStorage) ===== */
let cart = load("cart", {});
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  $("#cartCount").textContent = Object.values(cart).reduce((a, b) => a + b, 0);
}

/* ===== Генерація картки товару ===== */
function cardHTML(p) {
  return `<article class="card">
    <div class="ph" data-info="${p.id}">
      ${p.old ? '<span class="sale">Акція</span>' : ""}${p.emoji}
      <img src="images/${p.img}" alt="${p.name}" onerror="this.remove()">
    </div>
    <div class="in"><h3>${p.name}</h3>
      <div class="price">${money(p.price)}${p.old ? `<s>${money(p.old)}</s>` : ""}</div>
      <button class="btn" data-add="${p.id}">До кошика</button></div>
  </article>`;
}
function renderProducts(list, box) {
  box.innerHTML = list.length ? list.map(cardHTML).join("") : '<p class="empty">Нічого не знайдено</p>';
}


/* ===== Вміст модального вікна товару: фото, ціна, характеристики ===== */
function infoHTML(p) {
  const rows = [...(p.specs || []), ["Артикул", "PL-" + String(p.id).padStart(3, "0")], ["Наявність", "В наявності"]];
  return `<div class="mph">${p.emoji}<img src="images/${p.img}" alt="${p.name}" onerror="this.remove()"></div>
    <h3>${p.name}</h3>
    <p class="muted">Категорія: ${categories[p.cat]}</p>
    <p class="price">${money(p.price)}${p.old ? `<s>${money(p.old)}</s>` : ""}</p>
    <h4>Характеристики</h4>
    <table class="spec">${rows.map(r => `<tr><th>${r[0]}</th><td>${r[1]}</td></tr>`).join("")}</table>
    <button class="btn" data-add="${p.id}">До кошика</button>`;
}

/* ===== Модальні вікна (створюються через JS) ===== */
document.body.insertAdjacentHTML("beforeend", `
  <dialog id="cartDlg"><h3>Ваш кошик</h3><div id="cartList"></div>
    <div class="total" id="cartTotal"></div>
    <form class="f" id="orderForm" novalidate>
      <label>Ім'я<input name="name"></label>
      <label>Телефон<input name="phone" placeholder="+380..."></label>
      <div class="err" id="orderErr"></div>
      <button class="btn">Оформити замовлення</button>
      <button type="button" class="btn light" data-close>Закрити</button>
    </form></dialog>
  <dialog id="infoDlg"><div id="infoBody"></div>
    <button class="btn light" data-close style="margin-top:10px">Закрити</button></dialog>`);

function renderCart() {
  const ids = Object.keys(cart);
  let sum = 0;
  $("#cartList").innerHTML = ids.length ? ids.map(id => {
    const p = products.find(x => x.id == id); sum += p.price * cart[id];
    return `<div class="row"><span>${p.name}</span>
      <button data-dec="${id}">−</button><b>${cart[id]}</b><button data-inc="${id}">+</button>
      <b>${money(p.price * cart[id])}</b></div>`;
  }).join("") : '<p class="empty">Кошик порожній</p>';
  $("#cartTotal").textContent = "Разом: " + money(sum);
  $("#orderForm").style.display = ids.length ? "grid" : "none";
}

/* ===== Делегування кліків ===== */
document.addEventListener("click", e => {
  const t = e.target;
  if (t.dataset.add) { cart[t.dataset.add] = (cart[t.dataset.add] || 0) + 1; saveCart(); t.textContent = "Додано ✓"; setTimeout(() => t.textContent = "До кошика", 900); }
  if (t.dataset.inc) { cart[t.dataset.inc]++; saveCart(); renderCart(); }
  if (t.dataset.dec) { if (--cart[t.dataset.dec] <= 0) delete cart[t.dataset.dec]; saveCart(); renderCart(); }
  if (t.closest("[data-info]")) {
    const p = products.find(x => x.id == t.closest("[data-info]").dataset.info);
    $("#infoBody").innerHTML = infoHTML(p);
    $("#infoDlg").showModal();
  }
  if (t.dataset.close !== undefined) t.closest("dialog").close();
  if (t.closest("#openCart")) { renderCart(); $("#cartDlg").showModal(); }
});

/* ===== Оформлення замовлення з валідацією ===== */
$("#orderForm").addEventListener("submit", e => {
  e.preventDefault();
  const name = e.target.name.value.trim(), phone = e.target.phone.value.trim();
  if (name.length < 2) return $("#orderErr").textContent = "Введіть ім'я";
  if (!/^\+?\d{10,13}$/.test(phone.replace(/[\s()-]/g, ""))) return $("#orderErr").textContent = "Некоректний номер телефону";
  const orders = load("orders", []);
  orders.push({ name, phone, items: cart, date: new Date().toLocaleString("uk-UA") });
  localStorage.setItem("orders", JSON.stringify(orders));
  cart = {}; saveCart();
  $("#cartList").innerHTML = `<p class="empty">Дякуємо, ${name}! Замовлення №${orders.length} прийнято.</p>`;
  $("#cartTotal").textContent = ""; e.target.style.display = "none"; e.target.reset(); $("#orderErr").textContent = "";
});

/* ===== Головна: акційні товари ===== */
const sale = $("#saleGrid");
if (sale) renderProducts(products.filter(p => p.old), sale);

/* ===== Каталог: динамічний пошук, фільтр, сортування ===== */
const grid = $("#catalogGrid");
if (grid) {
  const params = new URLSearchParams(location.search);
  let cat = params.get("c") || "all";
  const q = $("#q"); q.value = params.get("q") || "";
  const sort = $("#sort");
  function update() {
    let list = products.filter(p => (cat === "all" || p.cat === cat) &&
      p.name.toLowerCase().includes(q.value.trim().toLowerCase()));
    if (sort.value === "asc") list.sort((a, b) => a.price - b.price);
    if (sort.value === "desc") list.sort((a, b) => b.price - a.price);
    if (sort.value === "name") list.sort((a, b) => a.name.localeCompare(b.name, "uk"));
    renderProducts(list, grid);
    $("#found").textContent = "Знайдено товарів: " + list.length;
    document.querySelectorAll(".chip").forEach(c => c.classList.toggle("on", c.dataset.cat === cat));
  }
  document.querySelectorAll(".chip").forEach(c => c.onclick = () => { cat = c.dataset.cat; update(); });
  q.addEventListener("input", update);
  sort.addEventListener("change", update);
  update();
}

/* ===== Контакти: форма відгуку, що динамічно додається на сторінку ===== */
const rf = $("#reviewForm");
if (rf) {
  const seed = [{ name: "Олена", text: "Швидка доставка, коту сподобався корм!", rate: 5 }];
  const showReviews = () => $("#reviews").innerHTML = [...seed, ...load("reviews", [])]
    .map(r => `<div class="rev"><b>${r.name}</b> ${"★".repeat(r.rate)}<p>${r.text}</p></div>`).join("");
  rf.addEventListener("submit", e => {
    e.preventDefault();
    const name = rf.name.value.trim(), email = rf.email.value.trim(), text = rf.text.value.trim();
    if (name.length < 2) return $("#revErr").textContent = "Вкажіть ім'я";
    if (!/^\S+@\S+\.\S+$/.test(email)) return $("#revErr").textContent = "Некоректний email";
    if (text.length < 5) return $("#revErr").textContent = "Напишіть повідомлення (мінімум 5 символів)";
    const all = load("reviews", []); all.push({ name, text, rate: +rf.rate.value });
    localStorage.setItem("reviews", JSON.stringify(all));
    rf.reset(); $("#revErr").textContent = ""; showReviews();
  });
  showReviews();
}
saveCart();
