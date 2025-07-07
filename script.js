function showSection(id) {
  document.getElementById('login-box').style.display = 'none';
  document.getElementById('register-box').style.display = 'none';
  document.getElementById('forgot-box').style.display = 'none';
  document.getElementById(id).style.display = 'block';
}

// Register Function
function register() {
  const name = document.getElementById('reg-name').value;
  const email = document.getElementById('reg-email').value;
  const password = document.getElementById('reg-password').value;

  if (!name || !email || !password) {
    alert("Please fill all fields.");
    return;
  }

  if (localStorage.getItem(email)) {
    alert("User already registered. Please login.");
    showSection('login-box');
  } else {
    const user = { name, email, password };
    localStorage.setItem(email, JSON.stringify(user));
    alert("Registration successful!");
    showSection('login-box');
  }
}

// Login Function
function login() {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  const user = JSON.parse(localStorage.getItem(email));
  if (!user) {
    alert("User not found. Please register.");
    showSection('register-box');
  } else if (user.password === password) {
    alert(`Welcome, ${user.name}!`);
    window.location.href = "dashboard.html"; // Your dashboard link
  } else {
    alert("Incorrect password.");
  }
}

// Forgot Password Function
function forgotPassword() {
  const email = document.getElementById('forgot-email').value;
  const user = JSON.parse(localStorage.getItem(email));
  if (!user) {
    alert("No user found with this email.");
  } else {
    alert("Your password is: " + user.password);
    showSection('login-box');
  }
}
// Live number animation
document.querySelectorAll('.value').forEach(el => {
  let target = parseInt(el.getAttribute("data-value"));
  let count = 0;
  let step = Math.ceil(target / 100);
  let isCurrency = el.innerText.includes("₹");
  let isItems = el.innerText.includes("Items");

  function update() {
    if (count < target) {
      count += step;
      if (count > target) count = target;

      if (isCurrency) {
        el.innerText = "₹" + count.toLocaleString();
      } else if (isItems) {
        el.innerText = count + " Items";
      } else {
        el.innerText = count;
      }

      setTimeout(update, 20);
    }
  }
  update();
});

// Date & Time live
function updateDateTime() {
  const now = new Date();
  document.getElementById('datetime').innerText =
    now.toLocaleString('en-IN', {
      dateStyle: 'full',
      timeStyle: 'short'
    });
}
updateDateTime();
setInterval(updateDateTime, 60000);
document.getElementById("todayDate").innerText =
  "Date: " + new Date().toLocaleDateString('en-IN');

function getPurchases() {
  return JSON.parse(localStorage.getItem("purchases") || "[]");
}

function savePurchases(purchases) {
  localStorage.setItem("purchases", JSON.stringify(purchases));
}

function addPurchase() {
  const date = document.getElementById("pDate").value;
  const itemCode = document.getElementById("pItemCode").value.trim();
  const itemName = document.getElementById("pItemName").value.trim();
  const size = document.getElementById("pSize").value.trim();
  const color = document.getElementById("pColor").value.trim();
  const qty = parseInt(document.getElementById("pQty").value);
  const buy = parseFloat(document.getElementById("pPurchasePrice").value);
  const sell = parseFloat(document.getElementById("pSalePrice").value);

  if (!date || !itemCode || !itemName || !qty || !buy || !sell) {
    alert("Please fill all required fields.");
    return;
  }

  const purchase = {
    date,
    itemCode,
    itemName,
    size,
    color,
    qty,
    buy,
    sell
  };

  const purchases = getPurchases();
  purchases.push(purchase);
  savePurchases(purchases);
  renderTable();
  clearForm();
}

function clearForm() {
  document.getElementById("pItemCode").value = "";
  document.getElementById("pItemName").value = "";
  document.getElementById("pSize").value = "";
  document.getElementById("pColor").value = "";
  document.getElementById("pQty").value = "";
  document.getElementById("pPurchasePrice").value = "";
  document.getElementById("pSalePrice").value = "";
}

function renderTable() {
  const purchases = getPurchases();
  const tbody = document.getElementById("purchaseTableBody");
  tbody.innerHTML = "";
  let total = 0;

  purchases.forEach(p => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${p.date}</td>
      <td>${p.itemCode}</td>
      <td>${p.itemName}</td>
      <td>${p.size}</td>
      <td>${p.color}</td>
      <td>${p.qty}</td>
      <td>₹${p.buy}</td>
      <td>₹${p.sell}</td>
    `;
    tbody.appendChild(row);
    total += p.qty * p.buy;
  });

  document.getElementById("totalPurchase").innerText = total.toLocaleString();
}

// Render existing on load
renderTable();
document.getElementById("currentDate").innerText =
  "Date: " + new Date().toLocaleDateString("en-IN");

function getPurchases() {
  return JSON.parse(localStorage.getItem("purchases") || "[]");
}

function getSales() {
  return JSON.parse(localStorage.getItem("sales") || "[]");
}

function saveSales(data) {
  localStorage.setItem("sales", JSON.stringify(data));
}

// Auto-fill item details from purchase by code
function autoFillSaleData() {
  const code = document.getElementById("saleCode").value.trim();
  const purchases = getPurchases();
  const item = purchases.find(p => p.itemCode === code);
  if (item) {
    document.getElementById("saleName").value = item.itemName;
    document.getElementById("saleSize").value = item.size;
    document.getElementById("saleColor").value = item.color;
    document.getElementById("salePrice").value = item.sell;
  } else {
    alert("Item Code not found in purchase.");
    document.getElementById("saleName").value = "";
    document.getElementById("saleSize").value = "";
    document.getElementById("saleColor").value = "";
    document.getElementById("salePrice").value = "";
  }
}

// Add Sale Entry
function addSale() {
  const date = document.getElementById("saleDate").value;
  const code = document.getElementById("saleCode").value.trim();
  const name = document.getElementById("saleName").value;
  const size = document.getElementById("saleSize").value;
  const color = document.getElementById("saleColor").value;
  const qty = parseInt(document.getElementById("saleQty").value);
  const price = parseFloat(document.getElementById("salePrice").value);

  if (!date || !code || !name || !qty || !price) {
    alert("Please fill all required fields.");
    return;
  }

  const sale = { date, code, name, size, color, qty, price, total: qty * price };
  const sales = getSales();
  sales.push(sale);
  saveSales(sales);
  renderSalesTable();
  clearForm();
}

function clearForm() {
  document.getElementById("saleCode").value = "";
  document.getElementById("saleName").value = "";
  document.getElementById("saleSize").value = "";
  document.getElementById("saleColor").value = "";
  document.getElementById("saleQty").value = "";
  document.getElementById("salePrice").value = "";
}

// Display Table
function renderSalesTable() {
  const sales = getSales();
  const tbody = document.getElementById("salesTableBody");
  tbody.innerHTML = "";
  let total = 0;

  sales.forEach(s => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${s.date}</td>
      <td>${s.code}</td>
      <td>${s.name}</td>
      <td>${s.size}</td>
      <td>${s.color}</td>
      <td>${s.qty}</td>
      <td>₹${s.price}</td>
      <td>₹${s.total}</td>
    `;
    tbody.appendChild(tr);
    total += s.total;
  });

  document.getElementById("totalSales").innerText = total.toLocaleString();
}

// Initial load
renderSalesTable();
document.getElementById("dateNow").innerText =
  "Date: " + new Date().toLocaleDateString("en-IN");

// Get data
const purchases = JSON.parse(localStorage.getItem("purchases") || "[]");
const sales = JSON.parse(localStorage.getItem("sales") || "[]");

function calculateInventory() {
  const inventory = {};

  // Count Purchases
  purchases.forEach(p => {
    const key = p.itemCode;
    if (!inventory[key]) {
      inventory[key] = {
        itemCode: p.itemCode,
        itemName: p.itemName,
        size: p.size,
        color: p.color,
        purchased: 0,
        sold: 0
      };
    }
    inventory[key].purchased += parseInt(p.qty);
  });

  // Count Sales
  sales.forEach(s => {
    const key = s.code;
    if (inventory[key]) {
      inventory[key].sold += parseInt(s.qty);
    }
  });

  return inventory;
}

function renderInventoryTable() {
  const inventory = calculateInventory();
  const tbody = document.getElementById("inventoryBody");
  tbody.innerHTML = "";

  Object.values(inventory).forEach(item => {
    const stock = item.purchased - item.sold;
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${item.itemCode}</td>
      <td>${item.itemName}</td>
      <td>${item.size}</td>
      <td>${item.color}</td>
      <td>${item.purchased}</td>
      <td>${item.sold}</td>
      <td>${stock > 0 ? stock : "❌ Out of Stock"}</td>
    `;
    tbody.appendChild(tr);
  });
}

renderInventoryTable();
function getProducts() {
  return JSON.parse(localStorage.getItem("products") || "[]");
}

function saveProducts(products) {
  localStorage.setItem("products", JSON.stringify(products));
}

function addProduct() {
  const code = document.getElementById("prodCode").value.trim();
  const name = document.getElementById("prodName").value.trim();
  const size = document.getElementById("prodSize").value.trim();
  const color = document.getElementById("prodColor").value.trim();
  const price = parseFloat(document.getElementById("prodPrice").value);

  if (!code || !name || !size || !color || !price) {
    alert("Please fill all fields.");
    return;
  }

  const products = getProducts();

  // Prevent duplicate code
  const existing = products.find(p => p.code === code);
  if (existing) {
    alert("Item Code already exists.");
    return;
  }

  products.push({ code, name, size, color, price });
  saveProducts(products);
  renderProductTable();
  clearForm();
}

function clearForm() {
  document.getElementById("prodCode").value = "";
  document.getElementById("prodName").value = "";
  document.getElementById("prodSize").value = "";
  document.getElementById("prodColor").value = "";
  document.getElementById("prodPrice").value = "";
}

function renderProductTable() {
  const products = getProducts();
  const tbody = document.getElementById("productTableBody");
  tbody.innerHTML = "";

  products.forEach((p, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p.code}</td>
      <td>${p.name}</td>
      <td>${p.size}</td>
      <td>${p.color}</td>
      <td>₹${p.price}</td>
      <td>
        <button class="action-btn edit-btn" onclick="editProduct(${index})">✏️</button>
        <button class="action-btn delete-btn" onclick="deleteProduct(${index})">🗑️</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function deleteProduct(index) {
  const products = getProducts();
  if (confirm("Delete this product?")) {
    products.splice(index, 1);
    saveProducts(products);
    renderProductTable();
  }
}

function editProduct(index) {
  const products = getProducts();
  const p = products[index];
  document.getElementById("prodCode").value = p.code;
  document.getElementById("prodName").value = p.name;
  document.getElementById("prodSize").value = p.size;
  document.getElementById("prodColor").value = p.color;
  document.getElementById("prodPrice").value = p.price;

  deleteProduct(index); // remove old, user will click Add to re-add updated
}

renderProductTable();
function getVendors() {
  return JSON.parse(localStorage.getItem("vendors") || "[]");
}

function saveVendors(vendors) {
  localStorage.setItem("vendors", JSON.stringify(vendors));
}

function addVendor() {
  const name = document.getElementById("vName").value.trim();
  const mobile = document.getElementById("vMobile").value.trim();
  const email = document.getElementById("vEmail").value.trim();
  const address = document.getElementById("vAddress").value.trim();

  if (!name || !mobile || !email || !address) {
    alert("Please fill all fields.");
    return;
  }

  const vendors = getVendors();

  // Check duplicate mobile number
  if (vendors.some(v => v.mobile === mobile)) {
    alert("Mobile number already exists.");
    return;
  }

  vendors.push({ name, mobile, email, address });
  saveVendors(vendors);
  renderVendorTable();
  clearVendorForm();
}

function clearVendorForm() {
  document.getElementById("vName").value = "";
  document.getElementById("vMobile").value = "";
  document.getElementById("vEmail").value = "";
  document.getElementById("vAddress").value = "";
}

function renderVendorTable() {
  const vendors = getVendors();
  const tbody = document.getElementById("vendorTableBody");
  tbody.innerHTML = "";

  vendors.forEach((v, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${v.name}</td>
      <td>${v.mobile}</td>
      <td>${v.email}</td>
      <td>${v.address}</td>
      <td>
        <button class="action-btn edit-btn" onclick="editVendor(${index})">✏️</button>
        <button class="action-btn delete-btn" onclick="deleteVendor(${index})">🗑️</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function deleteVendor(index) {
  const vendors = getVendors();
  if (confirm("Delete this entry?")) {
    vendors.splice(index, 1);
    saveVendors(vendors);
    renderVendorTable();
  }
}

function editVendor(index) {
  const vendors = getVendors();
  const v = vendors[index];
  document.getElementById("vName").value = v.name;
  document.getElementById("vMobile").value = v.mobile;
  document.getElementById("vEmail").value = v.email;
  document.getElementById("vAddress").value = v.address;
  vendors.splice(index, 1);
  saveVendors(vendors);
  renderVendorTable();
}

renderVendorTable();
document.getElementById("reportDate").innerText =
  "Date: " + new Date().toLocaleDateString("en-IN");

function getFromLS(key) {
  return JSON.parse(localStorage.getItem(key) || "[]");
}

function generateReports() {
  const products = getFromLS("products");
  const purchases = getFromLS("purchases");
  const sales = getFromLS("sales");

  let totalPurchase = 0;
  let totalSales = 0;

  // Sum purchases
  purchases.forEach(p => {
    totalPurchase += p.qty * p.buy;
  });

  // Sum sales
  sales.forEach(s => {
    totalSales += s.qty * s.price;
  });

  const profit = totalSales - totalPurchase;

  document.getElementById("rTotalProducts").innerText = products.length;
  document.getElementById("rTotalPurchase").innerText = totalPurchase.toLocaleString();
  document.getElementById("rTotalSales").innerText = totalSales.toLocaleString();
  document.getElementById("rProfitLoss").innerText = profit.toLocaleString();
}

generateReports();
document.getElementById("dateNow").innerText =
  "Date: " + new Date().toLocaleDateString("en-IN");

// Get / Save Admins
function getAdmins() {
  return JSON.parse(localStorage.getItem("admins") || "[]");
}
function saveAdmins(admins) {
  localStorage.setItem("admins", JSON.stringify(admins));
}

function addAdmin() {
  const mobile = document.getElementById("adminMobile").value.trim();
  const pass = document.getElementById("adminPass").value.trim();

  if (!mobile || !pass) {
    alert("Please fill all fields.");
    return;
  }

  const admins = getAdmins();

  // Prevent duplicate mobile
  if (admins.some(a => a.mobile === mobile)) {
    alert("Admin mobile already exists.");
    return;
  }

  admins.push({ mobile, pass });
  saveAdmins(admins);
  renderAdminTable();
  clearAdminForm();
}

function clearAdminForm() {
  document.getElementById("adminMobile").value = "";
  document.getElementById("adminPass").value = "";
}

function renderAdminTable() {
  const admins = getAdmins();
  const tbody = document.getElementById("adminTableBody");
  tbody.innerHTML = "";

  admins.forEach((a, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${a.mobile}</td>
      <td>${a.pass}</td>
      <td>
        <button class="action-btn edit-btn" onclick="editAdmin(${index})">✏️</button>
        <button class="action-btn delete-btn" onclick="deleteAdmin(${index})">🗑️</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function deleteAdmin(index) {
  const admins = getAdmins();
  if (confirm("Delete this admin?")) {
    admins.splice(index, 1);
    saveAdmins(admins);
    renderAdminTable();
  }
}

function editAdmin(index) {
  const admins = getAdmins();
  const a = admins[index];
  document.getElementById("adminMobile").value = a.mobile;
  document.getElementById("adminPass").value = a.pass;
  admins.splice(index, 1);
  saveAdmins(admins);
  renderAdminTable();
}

renderAdminTable();
