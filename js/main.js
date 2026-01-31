const catalog={"شرقي (كيلو)":[{name:"بسبوسة سادة",price:195},{name:"بسبوسة بندق",price:235},{name:"بسبوسة بندق مجروش",price:320},{name:"بسبوسة قشطة",price:450},{name:"بسبوسة مغربي",price:165},{name:"بسبوسة مانجو",price:275},{name:"كنافة بورمة بندق",price:190},{name:"كنافة بورمة فستق",price:275},{name:"كنافة بورمة سوداني",price:320},{name:"كنافة بصمة فستق",price:545},{name:"كنافة بصمة بندق",price:915},{name:"كنافة بصمة عين جمل",price:625},{name:"كنافة بصمة سوداني",price:990},{name:"كنافة سيجار سادة",price:270},{name:"كنافة سيجار بندق",price:340},{name:"كنافة سيجار سميد",price:350},{name:"كنافة سيجار فستق",price:265},{name:"كنافة سواريه",price:875},{name:"كنافة سواريه بندق",price:675},{name:"كنافة سواريه فستق",price:585},{name:"كنافة سواريه لوز",price:285},{name:"كنافة سواريه كريمة فستق",price:915},{name:"كنافة سواريه مشكل",price:420},{name:"كنافة مانجا",price:285},{name:"كنافة قشطة",price:310},{name:"مغشوشة سادة",price:400},{name:"مغشوشة فستق",price:255},{name:"مغشوشة مكسرات",price:295},{name:"بسيمة سادة",price:165},{name:"بسيمة بندق",price:320},{name:"هريسه ساده",price:265},{name:"هريسة بندق",price:340},{name:"هريسة باردة",price:275},{name:"الشكلمة",price:360}],"غربي/تريلتشي":[{name:"تريلتشى اوريو",price:200},{name:"تريلتشى تراميسو",price:200},{name:"تريلتشى كراميل",price:200},{name:"تريلتشى لوتس",price:200},{name:"تريلتشى مانجو",price:200},{name:"تريلتشى نوتيلا",price:200}]};const el={editIndex:document.getElementById("editIndex"),customerName:document.getElementById("customerName"),phone:document.getElementById("phone"),address:document.getElementById("address"),notes:document.getElementById("notes"),categorySelect:document.getElementById("categorySelect"),productSelect:document.getElementById("productSelect"),qty:document.getElementById("qty"),price:document.getElementById("price"),imageInput:document.getElementById("imageInput"),previewImage:document.getElementById("previewImage"),cartTable:document.getElementById("cartTable"),totalPrice:document.getElementById("totalPrice"),search:document.getElementById("search"),ordersTable:document.getElementById("ordersTable"),invoiceTemplate:document.getElementById("invoiceTemplate"),btnAddItem:document.getElementById("btnAddItem"),btnClearCart:document.getElementById("btnClearCart"),btnSaveOrder:document.getElementById("btnSaveOrder"),btnNewOrder:document.getElementById("btnNewOrder"),btnClearAll:document.getElementById("btnClearAll")};for(const k in el){if(!el[k]){console.error("Missing element:",k);alert("في عنصر ناقص في الصفحة. تأكد إنك ناسخ index.html زي ما هو.");break}}
let cart=[];let orders=JSON.parse(localStorage.getItem("orders"))||[];let imageData="";function saveToLS(){localStorage.setItem("orders",JSON.stringify(orders))}
function fileToBase64(file){return new Promise((resolve)=>{if(!file)return resolve("");const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.readAsDataURL(file)})}
function loadCategories(){el.categorySelect.innerHTML="";Object.keys(catalog).forEach((cat)=>{el.categorySelect.innerHTML+=`<option value="${cat}">${cat}</option>`});loadProducts(el.categorySelect.value)}
function loadProducts(category){const list=catalog[category]||[];el.productSelect.innerHTML="";list.forEach((p)=>{el.productSelect.innerHTML+=`<option value="${p.name}" data-price="${p.price}">${p.name}</option>`});updatePrice()}
function updatePrice(){const opt=el.productSelect.selectedOptions[0];el.price.value=opt?(opt.dataset.price||""):""}
function renderCart(){el.cartTable.innerHTML="";let sum=0;cart.forEach((item,i)=>{sum+=item.total;el.cartTable.innerHTML+=`
      <tr>
        <td>${item.product}</td>
        <td>${item.qty}</td>
        <td>${item.price}</td>
        <td>${item.total}</td>
        <td><button class="btn btn-danger btn-sm" data-remove="${i}">❌</button></td>
      </tr>
    `});el.totalPrice.textContent=String(sum)}
function addItemToCart(){const product=el.productSelect.value;const qty=Number(el.qty.value);const price=Number(el.productSelect.selectedOptions[0]?.dataset?.price||0);if(!product)return alert("اختار صنف");if(!qty||qty<=0)return alert("اكتب كمية صحيحة");cart.push({product,qty,price,total:qty*price});renderCart()}
function clearCart(){cart=[];renderCart()}
async function handleImageChange(){const file=el.imageInput.files[0];imageData=await fileToBase64(file);if(imageData){el.previewImage.src=imageData;el.previewImage.style.display="block"}else{el.previewImage.style.display="none"}}
async function saveOrder(){if(!el.customerName.value.trim())return alert("اكتب اسم العميل");if(!el.phone.value.trim())return alert("اكتب رقم الموبايل");if(!el.address.value.trim())return alert("اكتب العنوان");if(cart.length===0)return alert("لازم تضيف منتج واحد على الأقل");const idx=el.editIndex.value===""?null:Number(el.editIndex.value);if(idx!==null&&!imageData){imageData=orders[idx]?.image||""}
const order={id:idx!==null?orders[idx].id:Date.now(),customer:el.customerName.value.trim(),phone:el.phone.value.trim(),address:el.address.value.trim(),notes:el.notes.value.trim(),cart:[...cart],total:Number(el.totalPrice.textContent||0),image:imageData||""};if(idx===null){orders.push(order)}else{orders[idx]=order}
saveToLS();resetForm();renderOrders();alert("✅ تم حفظ الأوردر وظهر في القائمة تحت")}
function resetForm(){el.editIndex.value="";el.customerName.value="";el.phone.value="";el.address.value="";el.notes.value="";el.qty.value=1;cart=[];imageData="";el.imageInput.value="";el.previewImage.style.display="none";renderCart()}
function renderOrders(){const q=(el.search.value||"").toLowerCase();el.ordersTable.innerHTML="";orders.forEach((o,i)=>{if(!o.customer.toLowerCase().includes(q))return;const img=o.image?`<img src="${o.image}" class="table-img" alt="order">`:"—";el.ordersTable.innerHTML+=`
      <tr>
        <td>${i + 1}</td>
        <td>${img}</td>
        <td>${o.customer}</td>
        <td>${o.phone}</td>
        <td>${o.address}</td>
        <td>${o.total}</td>
        <td><button class="btn btn-warning btn-sm" data-edit="${i}">✏️</button></td>
        <td><button class="btn btn-secondary btn-sm" data-print="${i}">🖨</button></td>
        <td><button class="btn btn-danger btn-sm" data-del="${i}">🗑</button></td>
      </tr>
    `})}
function editOrder(i){const o=orders[i];el.customerName.value=o.customer;el.phone.value=o.phone;el.address.value=o.address;el.notes.value=o.notes;cart=[...o.cart];imageData=o.image||"";if(imageData){el.previewImage.src=imageData;el.previewImage.style.display="block"}else{el.previewImage.style.display="none"}
el.editIndex.value=String(i);renderCart();window.scrollTo({top:0,behavior:"smooth"})}
function deleteOrder(i){if(!confirm("متأكد من حذف الأوردر؟"))return;orders.splice(i,1);saveToLS();renderOrders()}
function printInvoice(i){const o=orders[i];const container=document.createElement("div");container.innerHTML=el.invoiceTemplate.innerHTML;container.querySelector("#invOrderId").textContent=i+1;container.querySelector("#invName").textContent=o.customer;container.querySelector("#invPhone").textContent=o.phone;container.querySelector("#invAddress").textContent=o.address;container.querySelector("#invTotal").textContent=o.total;const itemsBody=container.querySelector("#invItems");itemsBody.innerHTML="";o.cart.forEach((item)=>{itemsBody.innerHTML+=`
      <tr>
        <td>${item.product}</td>
        <td>${item.qty}</td>
        <td>${item.price}</td>
        <td>${item.total}</td>
      </tr>
    `});const w=window.open("","","width=420,height=650");w.document.open();w.document.write(`
    <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8" />
        <title>فاتورة</title>
      </head>
      <body>${container.innerHTML}</body>
    </html>
  `);w.document.close();w.focus();w.print()}
el.categorySelect.addEventListener("change",()=>loadProducts(el.categorySelect.value));el.productSelect.addEventListener("change",updatePrice);el.imageInput.addEventListener("change",handleImageChange);el.btnAddItem.addEventListener("click",addItemToCart);el.btnClearCart.addEventListener("click",clearCart);el.btnSaveOrder.addEventListener("click",saveOrder);el.btnNewOrder.addEventListener("click",resetForm);el.search.addEventListener("input",renderOrders);el.btnClearAll.addEventListener("click",()=>{if(!confirm("متأكد؟ هيمسح كل الأوردرات نهائيًا"))return;orders=[];saveToLS();renderOrders()});el.cartTable.addEventListener("click",(e)=>{const btn=e.target.closest("button[data-remove]");if(!btn)return;const index=Number(btn.dataset.remove);cart.splice(index,1);renderCart()});el.ordersTable.addEventListener("click",(e)=>{const editBtn=e.target.closest("button[data-edit]");const delBtn=e.target.closest("button[data-del]");const printBtn=e.target.closest("button[data-print]");if(editBtn)return editOrder(Number(editBtn.dataset.edit));if(delBtn)return deleteOrder(Number(delBtn.dataset.del));if(printBtn)return printInvoice(Number(printBtn.dataset.print))});loadCategories();renderCart();renderOrders()