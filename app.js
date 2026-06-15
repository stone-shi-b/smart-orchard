const SUPABASE_URL = "https://nfvdwbxiolwxwzzzbkxi.supabase.co";
const SUPABASE_KEY = "sb_publishable_QY_qGLWieoiKlqhl2JEbEQ__DIcXILl";

const prices = {
  "脆红桃": {
    "12个装": 69,
    "18个装": 89,
    "24个装": 109
  },
  "小白凤": {
    "12个装": 79,
    "18个装": 109,
    "24个装": 139
  }
};

const product = document.getElementById("product");
const spec = document.getElementById("spec");
const quantity = document.getElementById("quantity");
const totalPrice = document.getElementById("totalPrice");
const submitBtn = document.getElementById("submitOrder");

function updatePrice() {
  const productName = product.value;
  const specName = spec.value;
  const count = Number(quantity.value || 1);

  const unitPrice = prices[productName][specName];
  totalPrice.textContent = unitPrice * count;
}

product.addEventListener("change", updatePrice);
spec.addEventListener("change", updatePrice);
quantity.addEventListener("input", updatePrice);

updatePrice();

submitBtn.addEventListener("click", async function () {
  const customerName = document.getElementById("customerName").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const address = document.getElementById("address").value.trim();
  const remark = document.getElementById("remark").value.trim();

  if (!customerName) {
    alert("请输入收货人姓名");
    return;
  }

  if (!phone) {
    alert("请输入手机号");
    return;
  }

  if (!address) {
    alert("请输入收货地址");
    return;
  }

  const order = {
    order_no: "CM" + Date.now(),
    product_name: product.value,
    spec: spec.value,
    quantity: Number(quantity.value || 1),
    total_price: Number(totalPrice.textContent),
    customer_name: customerName,
    phone: phone,
    address: address,
    remark: remark
  };

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
      method: "POST",
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        "Prefer": "return=representation"
      },
      body: JSON.stringify(order)
    });

    if (!response.ok) {
      const errorText = await response.text();
      alert("提交失败：" + errorText);
      return;
    }

    alert("订单提交成功！");

    document.getElementById("customerName").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("address").value = "";
    document.getElementById("remark").value = "";
    quantity.value = 1;
    updatePrice();

  } catch (error) {
    alert("提交失败，请检查网络或数据库设置");
    console.error(error);
  }
});