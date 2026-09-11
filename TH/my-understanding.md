# My Understanding

ตอบแต่ละคำถามด้วยคำพูดของคุณเอง ไม่มีคำถามหลอก

เป้าหมายไม่ใช่คำตอบที่สมบูรณ์แบบ — แต่เป็นคำตอบที่ซื่อสัตย์ เขียนเหมือนกำลังอธิบายให้เพื่อนที่ไม่เคยใช้ Express หรือ React ฟัง เอกสารนี้เป็นจุดหลักที่ใช้ประเมินความเข้าใจของคุณ ดังนั้นโปรดใส่ใจและตั้งใจเขียน

อย่าก๊อปปี้จากเอกสารประกอบ โค้ดคอมเมนต์ หรือคำตอบจาก AI ถ้าคุณไม่แน่ใจเรื่องไหน ให้เขียนสิ่งที่คุณเข้าใจและระบุจุดที่ยังไม่มั่นใจไว้

---

## AI Code Contribution

| Rating | Description |
|---|---|
| 0 | **ไม่ได้ใช้ AI** ฉันไม่ได้ใช้ AI ในการสร้างโค้ด อธิบายแนวคิด แก้ไขบั๊ก หรือสอนฉัน |
| 1 | **ใช้ AI เพื่อการเรียนรู้เท่านั้น** ฉันไม่ได้ใช้ AI สร้างโค้ด แต่ใช้ AI อธิบายแนวคิด ทำความเข้าใจข้อผิดพลาด หรือชี้แนะแนวทาง |
| 2 | **เขียนโค้ดผสมผสานโดยมี AI ช่วยเหลือ** ฉันเขียนโค้ดเองบางส่วนและใช้โค้ดจาก AI บางส่วน และใช้ AI ช่วยทำความเข้าใจ แก้ไขบั๊ก หรือปรับปรุงโค้ด |
| 3 | **เรียนรู้จากโค้ดที่ AI สร้าง แล้วเขียนเอง** AI สร้างโค้ดตัวอย่างหรือให้คำแนะนำ แต่ฉันใช้ความเข้าใจนั้นมาเขียนหรือปรับแต่งโค้ดด้วยตัวเอง |
| 4 | **AI สร้างโค้ดให้ แต่ฉันเข้าใจมันอย่างครบถ้วน** AI สร้างโค้ดส่วนใหญ่หรือทั้งหมด แต่ฉันอธิบายได้ว่ามันทำงานอย่างไร ทำไมถึงทำงาน และส่วนหลัก ๆ เชื่อมกันอย่างไร |
| 5 | **AI สร้างโค้ดให้ แต่เข้าใจอย่างจำกัด** AI สร้างโค้ดส่วนใหญ่หรือทั้งหมด และฉันไม่สามารถอธิบายได้อย่างมั่นใจว่าทุกอย่างทำงานอย่างไรหรือทำไมถึงทำงาน |

**Rating ของฉัน:** 4

> ตอบส่วน "AI Process" ที่ท้ายเอกสารนี้ด้วย

---

## Backend

**1. HTTP method แต่ละตัวในแอปของคุณหมายถึงอะไร — GET, POST, PUT หรือ PATCH, และ DELETE? ทำไมเราถึงใช้ method ต่างกัน แทนที่จะใช้ POST สำหรับทุกอย่าง?**

*คำตอบของคุณ:*
- **GET**: ใช้ขออ่าน/ดึงข้อมูลจาก Server โดยไม่มีการเปลี่ยนแปลงข้อมูลใดๆ บน Server
- **POST**: ใช้ส่งข้อมูลชุดใหม่ไปให้ Server เพื่อสร้าง Resource ใหม่ขึ้นมา
- **PUT / PATCH**: ใช้แก้ไขข้อมูลเดิมที่มีอยู่บน Server (PUT จะเป็นการส่งไปแทนที่ข้อมูลเดิมทั้งหมด ส่วน PATCH เป็นการส่งไปแก้ไขเฉพาะบางฟิลด์)
- **DELETE**: ใช้ลบข้อมูลResource ออกจาก Server

เราต้องใช้ HTTP Method ต่างกันเพราะ REST API ยึดหลักความหมาย (Semantic Conventions) เพื่อสื่อถึงเจตนาของการทำงาน หากใช้ POST เพียงอย่างเดียวสำหรับทุกงาน:
1. ตัว Browser, Proxy หรือ Caching Layer จะไม่รู้ว่า Request ไหนปลอดภัยที่จะทำ Cache (เช่น GET) หรือ Request ไหนที่มีการปรับเปลี่ยนข้อมูลในระบบ
2. สถาปัตยกรรม URL/Route จะสับสนและดูแลรักษายาก เพราะแค่ดู URL จะไม่รู้เลยว่ากำลังทำ Action อะไรกับข้อมูล

---

**2. `express.json()` คืออะไร และจะเกิดอะไรขึ้นถ้าคุณลบมันออก?**

*คำตอบของคุณ:*
`express.json()` เป็น Built-in Middleware ของ Express ที่ทำหน้าที่แปลง (parse) ข้อมูล Request Body ที่ส่งเข้ามาในรูปแบบ JSON String ให้กลายเป็น JavaScript Object แล้วนำไปแนบไว้ที่ `req.body` ให้เราดึงไปใช้งานต่อได้ง่ายๆ

ถ้าลบออก: Express จะไม่ทำการ parse ข้อมูล JSON ที่ส่งมา ผลคือเมื่อมี Request แบบ `POST` หรือ `PUT` เข้ามา ตัวแปร `req.body` จะมีค่าเป็น `undefined` และจะเกิด Error เมื่อเราพยายามเข้าถึงฟิลด์ เช่น `req.body.name`

---

**3. `req.body`, `req.params`, และ `req.query` ต่างกันอย่างไร? ยกตัวอย่างจริงจาก API ของคุณสำหรับแต่ละตัว**

*คำตอบของคุณ:*
- **`req.body`**: เก็บข้อมูล Payload ที่ส่งมาจากฝั่ง Client ใน Request Body (ส่วนใหญ่เป็น JSON) สำหรับ HTTP POST/PUT
  *ตัวอย่างจากโค้ด:* ใน `POST /products` ค่า `req.body` จะเก็บ `{ "name": "Wireless Mouse", "price": 890, "quantity": 1 }`
- **`req.params`**: เก็บตัวแปรที่ส่งมากับเส้นทาง URL (Route Parameters) ที่เราตั้งด้วยเครื่องหมาย `:param`
  *ตัวอย่างจากโค้ด:* ใน `GET /products/:id` (เช่น `/products/1`) ค่า `req.params.id` จะได้เป็น `"1"`
- **`req.query`**: เก็บข้อมูลที่แนบมากับ Query String ต่อท้าย URL (เริ่มด้วยเครื่องหมาย `?`)
  *ตัวอย่างจากโค้ด:* ใน `GET /products?name=mouse&sort=price` ค่า `req.query` จะได้เป็น `{ name: "mouse", sort: "price" }`

---

**4. HTTP status codes คืออะไร? ระบุทุก status code ที่คุณใช้ใน API ของคุณ และอธิบายว่าทำไมถึงเลือกใช้ในสถานการณ์นั้น**

*คำตอบของคุณ:*
HTTP status code คือรหัสตัวเลข 3 หลักมาตรฐานที่ Server ส่งกลับไปให้ Client เพื่อแจ้งผลลัพธ์ของการประมวลผล Request นั้นๆ

Status Code ที่ใช้ใน API นี้:
- **200 OK**: ส่งกลับเมื่อการอ่าน (GET), แก้ไข (PUT) หรือลบ (DELETE) ทำงานสำเร็จ
- **201 Created**: ส่งกลับเมื่อการสร้างข้อมูลสินค้าใหม่ผ่าน `POST /products` ทำงานสำเร็จ
- **400 Bad Request**: ส่งกลับเมื่อข้อมูลที่ Client ส่งมาไม่ถูกต้องตามเงื่อนไข (Validation Failed) เช่น ไม่ใส่ชื่อสินค้า หรือใส่ราคาติดลบ
- **404 Not Found**: ส่งกลับเมื่อค้นหาสินค้าตาม ID ที่ระบุไม่เจอ หรือเรียกเส้นทาง URL ที่ไม่มีในระบบ
- **500 Internal Server Error**: ส่งกลับโดย Error Handling Middleware เมื่อเกิดข้อผิดพลาดที่ไม่คาดคิดขึ้นใน Server

---

**5. middleware คืออะไร? อธิบายด้วยคำพูดของคุณเองว่ามันทำอะไร พร้อมยกตัวอย่าง 1 อย่างจากโค้ดของคุณ**

*คำตอบของคุณ:*
Middleware คือฟังก์ชันที่ทำงานตรงกลางระหว่างที่ Server ได้รับ Request เข้ามา จนกระทั่งส่ง Response ออกไป มันมีสิทธิ์ตรวจสอบ แก้ไขข้อมูล หรือตัดสินใจว่าจะส่งงานต่อให้ฟังก์ชันถัดไปผ่านคำสั่ง `next()` หรือไม่

*ตัวอย่างจากโค้ด:* Custom Request Logger Middleware ใน `server/index.js`:
```js
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});
```
ทำหน้าที่บันทึกเวลา, HTTP Method และ URL ของทุก Request ที่วิ่งเข้ามาลง Console ก่อนจะเรียก `next()` เพื่อส่งไปทำงานต่อที่ Product Routes

---

**6. ทำไม order ของ middleware ใน Express ถึงสำคัญ? จะเกิดอะไรขึ้นถ้า order ผิด?**

*คำตอบของคุณ:*
Express จะรัน Middleware เรียงตามลำดับจากบนลงล่างตามที่เขียน `app.use()` ไว้ ลำดับจึงสำคัญมากเพราะ:
1. ถ้าวาง `express.json()` ไว้ *หลัง* Route Handlers เมื่อเข้ามาใน Route ตัว `req.body` จะยังเป็น `undefined`
2. ถ้าวาง Request Logger ไว้ *หลัง* Route Handlers โค้ด Logger จะไม่มีวันได้ทำงาน เพราะ Route Handler ได้ส่ง Response จบงานไปก่อนแล้ว
3. ถ้าวาง Error Handling Middleware ไว้ *ก่อน* Route Handlers ตัว Error Handler จะไม่สามารถดักจับ Error ที่เกิดขึ้นภายใน Route Handlers ได้ เพราะ Express ยังวิ่งไปไม่ถึง

---

**7. อธิบายทีละขั้นตอนว่าเกิดอะไรขึ้นบน server เมื่อ request แบบ POST ถูกส่งไปที่ `/products`**

*คำตอบของคุณ:*
1. **Receive Request**: Client ส่ง HTTP Request แบบ `POST` มาที่ `http://localhost:3000/products` พร้อมแนบ JSON ใน Body
2. **`express.json()`**: แปลง JSON ใน Body ให้เป็น JavaScript Object แล้วเอาไปใส่ใน `req.body`
3. **CORS Middleware**: ตรวจสอบ Header และใส่ `Access-Control-Allow-Origin` อนุญาตให้ Origin `http://localhost:5173` เข้าถึงได้
4. **Logger Middleware**: บันทึก Log ลง Console (`[Timestamp] POST /products`) แล้วเรียก `next()`
5. **Route Matching**: Express จับคู่ URL กับ `POST /` ใน `server/routes/products.js`
6. **Validation Check**: เช็คว่า `req.body.name` มีค่าไหม และ `req.body.price` เป็นตัวเลขมากกว่าหรือเท่ากับ 0 หรือไม่ ถ้าไม่ผ่านจะคืน HTTP 400
7. **Create Data**: สร้าง Object สินค้าใหม่ กำหนด `id: String(Date.now())` แล้ว `push` ลงใน `products` array ใน RAM
8. **Send Response**: ส่ง HTTP `201 Created` พร้อมคืน JSON ของสินค้าชิ้นใหม่กลับไปให้ Client

---

**8. CRUD คืออะไร? จับคู่แต่ละ operation กับ HTTP method และ route ที่คุณใช้ใน API**

*คำตอบของคุณ:*
CRUD คือการทำงานพื้นฐาน 4 อย่างในการจัดการข้อมูล (Create, Read, Update, Delete)

| CRUD Operation | HTTP Method | Express Route | คำอธิบาย |
|---|---|---|---|
| **Create** | `POST` | `/products` | เพิ่มสินค้าใหม่ |
| **Read (All)** | `GET` | `/products` | ดึงรายการสินค้าทั้งหมด (รองรับ Filter & Sort) |
| **Read (One)** | `GET` | `/products/:id` | ดึงข้อมูลสินค้าเฉพาะชิ้นตาม ID |
| **Update** | `PUT` | `/products/:id` | แก้ไขข้อมูลสินค้าเดิมทั้งหมดตาม ID |
| **Delete** | `DELETE` | `/products/:id` | ลบสินค้าออกจากรายการตาม ID |

---

**9. API ของคุณตอบสนองอย่างไรเมื่อมีอะไรผิดพลาด — เช่น เมื่อ product ตาม ID ที่ระบุไม่มีอยู่จริง?**

*คำตอบของคุณ:*
เมื่อค้นหาสินค้าไม่เจอ (เช่น `GET /products/999`):
1. ใน Route Handler จะตรวจสอบด้วย `products.find(p => p.id === req.params.id)`
2. เมื่อได้ค่า `undefined` จะสร้าง `Error` Object กำหนด `err.status = 404` แล้วส่งต่อไปที่ `next(err)`
3. Centralized Error Handling Middleware ด้านล่างสุดของ `server/index.js` จะรับ Error มา แล้วตอบกลับด้วย HTTP `404 Not Found` พร้อมส่ง JSON:
```json
{
  "error": "Product with id \"999\" not found",
  "status": 404
}
```

---

## Frontend & Integration

**10. CORS คืออะไร และแก้ปัญหาอะไร? คุณจะเห็นอะไรใน browser ถ้าไม่ได้ config ไว้บน server?**

*คำตอบของคุณ:*
CORS (Cross-Origin Resource Sharing) คือกลไกความปลอดภัยของ Web Browser ที่ป้องกันไม่ให้สคริปต์หน้าเว็บจาก Origin หนึ่ง (เช่น `http://localhost:5173`) ไปดึงข้อมูลจาก API ต่าง Origin (เช่น `http://localhost:3000`) โดยไม่ได้รับอนุญาต

ถ้าไม่ได้ Config CORS บน Server: Browser จะบล็อกการดึงข้อมูลและแสดง Error สีแดงบน Console ว่า:
`Access to fetch at 'http://localhost:3000/products' from origin 'http://localhost:5173' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.`

---

**11. แอป React ของคุณ fetch ข้อมูลจาก API ที่ไหน? อธิบายว่า `useEffect` ในโค้ดนั้นทำอะไร และทำไมถึงไม่เรียก fetch ตรง ๆ ใน component body**

*คำตอบของคุณ:*
แอป React ดึงข้อมูลผ่านฟังก์ชัน `getProducts()` ใน `client/src/api/products.js` ซึ่งถูกเรียกใช้ภายใน `useEffect` ใน `App.jsx`:
```js
useEffect(() => {
  fetchProducts();
}, [fetchProducts]);
```

- **`useEffect` ทำอะไร**: ทำหน้าที่สั่งให้ดึงข้อมูลจาก API เมื่อ Component เริ่มแสดงผล (Mount) และเมื่อค่า Search หรือ Sort เปลี่ยนแปลง
- **ทำไมไม่เรียก fetch ตรงๆ ใน Body**: ถ้าเรียก `fetch` ตรงๆ ใน Body ของ Component เมื่อดึงข้อมูลเสร็จเราต้องสั่ง `setProducts()` เพื่ออัปเดต State ซึ่งการเปลี่ยน State จะสั่งให้ Component Re-render ใหม่ และการ Re-render ใหม่ก็จะไปเรียก `fetch` ซ้ำอีก เกิดเป็น **Infinite Render Loop** (หน้าเว็บค้างหรือพัง)

---

**12. API base URL ของคุณถูกกำหนดไว้ที่ไหน และทำไมถึงใส่ไว้ตรงนั้นแทนที่จะ hardcode ไว้ในทุก fetch call?**

*คำตอบของคุณ:*
ถูกกำหนดไว้ใน `client/.env`:
`VITE_API_URL=http://localhost:3000`

และนำไปใช้อย่างรวมศูนย์ใน `client/src/api/products.js` ผ่าน `import.meta.env.VITE_API_URL`

เหตุผลที่ใส่ไว้ที่เดียว: เพื่อไม่ต้องตามแก้ Code ทุกไฟล์เมื่อมีการเปลี่ยน Port หรือเปลี่ยน Domain Server ในอนาคต แค่แก้ไฟล์ `.env` ที่เดียว ทุกการเชื่อมต่อจะเปลี่ยนตามทันที

---

**13. เลือก action 1 อย่างในแอปของคุณ — เช่น การลบ product อธิบายตั้งแต่ต้นจนจบ: เกิดอะไรขึ้นตั้งแต่ผู้ใช้คลิกปุ่ม ไปจนถึง request ถึง server และหน้าจออัปเดตด้วย list ใหม่**

*คำตอบของคุณ:*
1. **User Click**: ผู้ใช้กดปุ่ม "Delete" ที่การ์ดสินค้าใน `ProductList.jsx`
2. **Event Trigger**: เรียกฟังก์ชัน `onDelete(id)` ใน `App.jsx`
3. **HTTP Fetch**: เรียก `deleteProduct(id)` ส่งคำสั่ง `fetch('http://localhost:3000/products/1', { method: 'DELETE' })`
4. **Server Processing**: Express รับคำสั่ง `DELETE /products/1` ค้นหาดัชนีของ ID `"1"` ใน Array แล้วสั่ง `products.splice(index, 1)` เพื่อลบออก
5. **Server Response**: Server ตอบกลับ HTTP `200 OK` พร้อม JSON ยืนยันการลบ
6. **React State Update**: ฝั่ง React ได้รับ Response สำเร็จ เรียก `setProducts(prev => prev.filter(p => p.id !== id))`
7. **Re-render**: React ตรวจพบ State เปลี่ยนแปลง จึงสั่ง Re-render หน้าจอใหม่ ทำให้การ์ดสินค้านั้นหายไปทันทีโดยไม่ต้องกด F5

---

**14. แอปของคุณแสดงอะไรให้ผู้ใช้เห็นระหว่างที่ข้อมูลกำลังโหลด และแสดงอะไรถ้า fetch ล้มเหลว (เช่น server ไม่ได้รันอยู่)? ทำไมเรื่องนี้ถึงสำคัญ?**

*คำตอบของคุณ:*
- **ขณะกำลังโหลด**: แสดง Spinner พร้อมข้อความ *"Loading products from server..."*
- **ถ้า Fetch ล้มเหลว**: แสดงการ์ดแจ้งเตือนสีแดง *"Connection Error: Failed to load products. Is the server running on http://localhost:3000?"* พร้อมปุ่ม *"Try Again"*

*ทำไมถึงสำคัญ*: เพื่อประสบการณ์ใช้งานที่ดี (UX) หากไม่มี Loading State ผู้ใช้จะคิดว่าแอปค้าง และหากไม่มี Error Handling เมื่อ Server ปิด หน้าเว็บจะขาวพังแบบเงียบๆ การแสดง Error ชัดเจนช่วยให้ผู้ใช้รู้ว่าปัญหาเกิดจากอะไร (เช่น ลืมเปิด Server)

---

**15. หลังจากที่คุณ add, edit, หรือ delete product แล้ว list บนหน้าจอของคุณอัปเดตโดยไม่ต้อง refresh หน้าเว็บ อธิบายว่าทำไมถึงเป็นแบบนั้น — อะไรที่ทำให้ React re-render ด้วยข้อมูลใหม่?**

*คำตอบของคุณ:*
**ความแตกต่างระหว่าง Server State กับ UI State:**
- **Server State**: ข้อมูลจริงที่เก็บบน Express Server (ใน `products` array ใน RAM)
- **UI State**: ข้อมูลจำลองที่เก็บบนความจำของ React Component (`useState` ใน `App.jsx`) ใช้สำหรับวาดหน้าจอ

**ทำไมถึง Re-render โดยไม่ต้อง F5:**
เมื่อมี Action (Add, Edit, Delete) ทำงานสำเร็จ:
1. เราส่ง HTTP Request ไปเปลี่ยนแปลง **Server State** ก่อน
2. เมื่อ Server ตอบกลับมาเป็น `200 OK` หรือ `201 Created` เราจะเรียก `setProducts()` เพื่ออัปเดต **UI State**:
   - Add: `setProducts(prev => [newProduct, ...prev])`
   - Edit: `setProducts(prev => prev.map(...))`
   - Delete: `setProducts(prev => prev.filter(...))`
3. การเรียก `setProducts()` เปลี่ยนแปลง React State ส่งผลให้ React สั่ง Re-render คอมโพเนนต์ `App` และส่ง Props ชุดใหม่ไปให้ `ProductList` วาดหน้าจอใหม่ทันที

---

**16. ส่วนไหนที่ยากที่สุดในการเชื่อมแอป React ของคุณเข้ากับ Express API และคุณทำอย่างไรถึงผ่านมันมาได้?**

*คำตอบของคุณ:*
ส่วนที่ยากที่สุดคือการจัดการ Error ให้สอดคล้องกันระหว่าง Server กับ React เพราะคำสั่ง `fetch()` มาตรฐานจะไม่ปฏิเสธ (reject) Promise เมื่อเจอ HTTP Status `400` หรือ `404` ทำให้ Error จาก Server ไม่วิ่งเข้าบล็อก `catch` บน React

*วิธีผ่านปัญหา:* เขียน helper `handleResponse()` ใน `client/src/api/products.js`:
```js
async function handleResponse(res) {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.messages?.join(", ") || data?.error || `HTTP ${res.status}`);
  }
  return data;
}
```
เพื่อเช็ค `if (!res.ok)` แล้วสั่ง `throw Error` ข้อความจาก Server ออกมา ทำให้ฝั่ง React ดักจับใน `catch` และนำข้อความ Validation Error มาแสดงบนฟอร์มได้อย่างถูกต้อง

---

## AI Process

**17. ถ้าคุณใช้ AI สร้างโค้ด คุณแบ่งงานออกเป็นขั้นตอนหรือ prompt อย่างไร? ยกตัวอย่าง prompt จริงที่คุณใช้ 1 อัน แทนที่จะเป็น prompt เดียวแบบ "สร้างทั้งแอปให้หน่อย"**

*คำตอบของคุณ:*
แบ่งงานออกเป็นส่วนเล็กๆ สองฝั่ง:
1. สแกฟโฟลด์ Express Server และเขียน middleware
2. สร้าง Express Router และ 5 CRUD Routes
3. สร้าง React Client ด้วย Vite และเขียน API Service Layer
4. สร้าง Form, List และ Search/Sort Components

*ตัวอย่าง Prompt ที่ใช้:*
`"สร้าง Express Router ในไฟล์ server/routes/products.js ที่มี 5 CRUD routes สำหรับจัดการ in-memory array พร้อมตรวจสอบว่าถ้า name หรือ price ส่งมาไม่ถูกต้องให้ตอบ HTTP 400 Bad Request"`

---

**18. อธิบายสิ่งที่ AI tool สร้างให้ 1 อย่างที่คุณเปลี่ยน แก้ไข หรือปฏิเสธ — พร้อมเหตุผลว่าทำไม**

*คำตอบของคุณ:*
ตอนแรก AI สร้าง Route ทั้งหมดรวมไว้ในไฟล์เดียวที่ `server/index.js`

*สิ่งที่ผมแก้ไข*: ผมทำการ Refactor โดยแยก Route ทั้งหมดออกไปไว้ในไฟล์ `server/routes/products.js` แล้วนำมาเรียกผ่าน `express.Router()` ใน `index.js`
*เหตุผล*: เพื่อให้โค้ดเป็นสัดส่วน (Modularity) อ่านง่าย และตรงตามหลักปฏิบัติที่ดี (Stretch Goal Best Practices)

---

**19. อธิบาย bug หรือ error จริง ๆ ที่คุณเจอระหว่าง build โปรเจกต์นี้ 1 อย่าง คุณหาสาเหตุที่แท้จริงได้อย่างไร นอกเหนือจากการ copy error ไปถามใน chat?**

*คำตอบของคุณ:*
*บั๊กที่เจอ*: เมื่อกดเพิ่มสินค้าผ่านฟอร์มใน React ตัว Server ตอบกลับเป็น `400 Bad Request`

*การวิเคราะห์หาสาเหตุ*: ผมเปิด DevTools ในเบราว์เซอร์ ดูแท็บ Network ดู Request Payload ที่ส่งไป พบว่าฟิลด์ `price` ถูกส่งไปเป็น String `"1500"` แทนที่จะเป็นตัวเลข `1500` ทำให้โค้ดตรวจสอบเงื่อนไข `typeof price !== 'number'` ฝั่ง Server ตรวจไม่ผ่าน

*การแก้ไข*: ใน `ProductForm.jsx` แปลงค่า `form.price` ให้เป็นตัวเลขด้วย `Number(form.price)` ก่อนส่งออกไป

---

**20. เลือก route (backend) หรือ component (frontend) 1 อันที่ AI ช่วยสร้าง โดยไม่ย้อนกลับไปดู AI chat history อธิบายว่ามันทำอะไรและทำไมถึงทำงาน ด้วยคำพูดของคุณเอง**

*คำตอบของคุณ:*
*คอมโพเนนต์*: `ProductForm.jsx`

*มันทำอะไร*: เป็นฟอร์มสำหรับรับข้อมูลชื่อ, ราคา และจำนวนสินค้า เพื่อใช้ทั้งเพิ่มสินค้าใหม่ (Add) และแก้ไขสินค้าเดิม (Edit)

*ทำไมถึงทำงานได้*:
1. มันใช้ State `form` ในการผูกค่าเข้ากับช่อง Input ทุกช่อง
2. ใช้ `useEffect` คอยดักดู prop `editingProduct` หากมีสินค้าส่งมา (โหมด Edit) มันจะนำข้อมูลสินค้านั้นมาเติมในฟอร์มให้อัตโนมัติ หากไม่มี (โหมด Add) จะล้างฟอร์มเป็นค่าว่าง
3. เมื่อกด Submit มันจะตรวจข้อมูลฝั่ง Client ก่อน ถ้าผ่านจะแปลงค่าตัวเลขแล้วส่งไปให้ `onSubmit` หาก Server ตอบกลับเป็น Error 400 มันจะดักจับและนำข้อความ Error มาแสดงในกล่องสีแดงบนฟอร์ม
