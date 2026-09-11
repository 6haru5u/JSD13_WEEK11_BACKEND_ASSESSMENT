# My Understanding

---

## AI Code Contribution

| Rating | Description |
|---|---|
| 2 | **Mixed coding with AI support.** I wrote some code myself and used some AI-generated code. I also used AI to help me understand, debug, or improve my solution. |

**My rating:** 2

---

## Backend

**1. What does each HTTP method in your API mean — GET, POST, PUT or PATCH, and DELETE? Why do we use different methods instead of just using POST for everything?**

*Your answer:*
- **GET**: Used to read/retrieve data from the server without modifying anything on the server.
- **POST**: Used to send new data to the server to create a new resource.
- **PUT / PATCH**: Used to update an existing resource (PUT replaces the entire resource; PATCH updates specified fields).
- **DELETE**: Used to remove a resource from the server.

We use different HTTP methods because REST APIs follow semantic conventions that express **intent**. If everything were a `POST` request:
1. It would be impossible for browsers, proxies, and HTTP tools to know if a request is safe to cache (like GET) or if it mutates data.
2. Route definitions would become ambiguous and harder to maintain because the URL alone wouldn't describe what action is taking place.

---

**2. What is `express.json()` and what would happen if you left it out?**

*Your answer:*
`express.json()` is a built-in Express middleware that parses incoming HTTP request bodies containing JSON data and attaches the parsed object to `req.body`.

If you leave it out, Express will not parse the incoming JSON payload. As a result, `req.body` will be `undefined` inside your route handlers when handling `POST` or `PUT` requests, causing errors like `Cannot read property 'name' of undefined` when trying to access `req.body.name`.

---

**3. What is the difference between `req.body`, `req.params`, and `req.query`? Give a real example from your API for each one.**

*Your answer:*
- **`req.body`**: Holds data sent in the request payload (typically JSON) for POST/PUT requests.
  *Example:* In `POST /products`, `req.body` contains `{ "name": "Wireless Mouse", "price": 890, "quantity": 1 }`.
- **`req.params`**: Holds route parameters extracted from path segments defined with a colon (`:`).
  *Example:* In `GET /products/:id` (e.g. `/products/1`), `req.params.id` is `"1"`.
- **`req.query`**: Holds key-value pairs parsed from the URL search query string (after `?`).
  *Example:* In `GET /products?name=mouse&sort=price`, `req.query` is `{ name: "mouse", sort: "price" }`.

---

**4. What are HTTP status codes? List every status code you used in your API and explain why you chose it for that situation.**

*Your answer:*
HTTP status codes are standard 3-digit numbers returned by the server to inform the client about the outcome of an HTTP request.

Status codes used in this API:
- **200 OK**: Returned for successful read, update, or delete operations (e.g. `GET /products`, `PUT /products/:id`, `DELETE /products/:id`).
- **201 Created**: Returned when a new product is successfully created via `POST /products`.
- **400 Bad Request**: Returned when incoming request body validation fails (e.g., missing product `name` or negative `price`).
- **404 Not Found**: Returned when a requested product ID does not exist in the array or when an unhandled route URL is hit.
- **500 Internal Server Error**: Returned by the centralized error-handling middleware when an unexpected error occurs on the server.

---

**5. What is middleware? Describe what it does in your own words and give one example from your code.**

*Your answer:*
Middleware is a function that sits between receiving an incoming request and sending the final response. It can inspect, modify, or log requests, perform validation, and decide whether to pass control to the next middleware by calling `next()`.

*Example from code:* The custom Request Logger middleware in `server/index.js`:
```js
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});
```
This logs every incoming request method and URL before passing control to the product routes via `next()`.

---

**6. Why does the order of middleware matter in Express? What could go wrong if it were in the wrong order?**

*Your answer:*
Express executes middleware sequentially in the exact order they are registered with `app.use()`.

What could go wrong:
1. If `express.json()` is placed *after* route definitions, `req.body` will be `undefined` when the route handlers run.
2. If custom logging middleware is placed *after* route handlers, it will never execute for requests that end with a response.
3. If error-handling middleware is placed *before* route handlers, it won't catch errors thrown inside those handlers because Express hasn't reached those routes yet.

---

**7. Walk through what happens on the server, step by step, when a POST request is sent to `/products`.**

*Your answer:*
1. **Request Received**: The client sends a `POST` request to `http://localhost:3000/products` with JSON headers and body.
2. **`express.json()` Middleware**: Parses the incoming JSON body and populates `req.body`.
3. **CORS Middleware**: Checks headers and attaches `Access-Control-Allow-Origin` allowing `http://localhost:5173`.
4. **Logger Middleware**: Logs timestamp, method (`POST`), and path (`/products`), then calls `next()`.
5. **Router Matching**: Express matches `/products` to `productsRouter` and calls the `POST /` route handler.
6. **Validation**: The handler checks if `name` and `price` exist and are valid. If invalid, returns HTTP 400 with error details.
7. **Creation**: Creates a new product object with a unique string `id` (`String(Date.now())`) and pushes it into the `products` array.
8. **Response**: Sends back HTTP `201 Created` with the new product JSON.

---

**8. What is CRUD? Map each operation to the HTTP method and route you used in your API.**

*Your answer:*
CRUD stands for Create, Read, Update, Delete — the four basic operations of persistent storage.

| CRUD Operation | HTTP Method | Express Route | Description |
|---|---|---|---|
| **Create** | `POST` | `/products` | Add a new product to the list |
| **Read (All)** | `GET` | `/products` | Retrieve all products (with optional filtering/sorting) |
| **Read (One)** | `GET` | `/products/:id` | Retrieve a single product by ID |
| **Update** | `PUT` | `/products/:id` | Update an existing product's fields |
| **Delete** | `DELETE` | `/products/:id` | Remove a product by ID |

---

**9. How does your API respond when something goes wrong — for example, when a product with a given ID does not exist?**

*Your answer:*
When a product ID doesn't exist (e.g. `GET /products/999`):
1. The route handler checks `products.find(p => p.id === req.params.id)`.
2. Finding `undefined`, it creates an `Error` object with `err.status = 404` and passes it to `next(err)`.
3. The centralized error-handling middleware at the end of `server/index.js` receives `err`, sets the status code to `404`, and sends a JSON response:
```json
{
  "error": "Product with id \"999\" not found",
  "status": 404
}
```

---

## Frontend & Integration

**10. What is CORS, and what problem does it solve? What would you see in your browser if it wasn't configured on your server?**

*Your answer:*
CORS (Cross-Origin Resource Sharing) is a browser security mechanism that restricts a web page running at one origin (e.g. `http://localhost:5173`) from making HTTP requests to a server running at a different origin (e.g. `http://localhost:3000`).

CORS solves cross-origin authorization by allowing the server to specify which origins are trusted.

Without CORS configured on the server, the browser's JavaScript engine blocks the request response and displays a console error like:
`Access to fetch at 'http://localhost:3000/products' from origin 'http://localhost:5173' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.`

---

**11. Where does your React app fetch data from your API? Walk through what `useEffect` is doing in that code, and why the fetch isn't just called directly in the component body.**

*Your answer:*
The React app fetches data inside `App.jsx` within a `useEffect` hook:
```js
useEffect(() => {
  fetchProducts();
}, [fetchProducts]);
```

- **What `useEffect` is doing**: It triggers `fetchProducts()` asynchronously when the component mounts and whenever search or sort parameters change.
- **Why not directly in component body**: If you call `fetch()` directly in the component body, every time React renders, it executes `fetch()`, which triggers state updates (`setProducts`), which forces another render, leading to an **infinite render loop**. `useEffect` isolates side effects and controls when they run.

---

**12. Where is your API's base URL defined, and why did you put it there instead of hardcoding it in every fetch call?**

*Your answer:*
The base URL is defined in `client/.env` as:
`VITE_API_URL=http://localhost:3000`

It is accessed centrally in `client/src/api/products.js` using `import.meta.env.VITE_API_URL`.

Putting it in one place avoids hardcoding strings across multiple components. If the server port or domain changes in staging/production, we only update `.env` rather than hunting down every `fetch` call in the project.

---

**13. Pick one action in your app — for example, deleting a product. Walk through the full round trip: what happens from the moment the user clicks the button, to the request reaching your server, to the screen updating with the new list.**

*Your answer:*
1. **User Action**: User clicks the "Delete" button on a product card in `ProductList.jsx`.
2. **React Event Handler**: Fires `onDelete(id)` in `App.jsx`.
3. **HTTP Request**: `deleteProduct(id)` executes `fetch('http://localhost:3000/products/1', { method: 'DELETE' })`.
4. **Server Routing**: Express receives `DELETE /products/1`, matches it in `routes/products.js`, finds index of ID `"1"`, and removes it using `products.splice(index, 1)`.
5. **Server Response**: Server returns HTTP `200 OK` with JSON `{ message: "Product deleted", product: ... }`.
6. **Client State Update**: React receives successful response and calls `setProducts(prev => prev.filter(p => p.id !== id))`.
7. **Re-render**: React updates local state, causing `ProductList` to re-render without reloading the page.

---

**14. What does your app show the user while data is loading, and what does it show if the fetch fails (e.g. the server isn't running)? Why does that matter?**

*Your answer:*
- **While Loading**: Displays a loading indicator with a spinner and text "Loading products from server...".
- **If Fetch Fails**: Displays a styled red connection error banner: *"Connection Error: Failed to load products. Is the server running on http://localhost:3000?"* along with a "Try Again" button.

*Why it matters*: Users need clear feedback. If loading isn't indicated, users assume the app is broken or frozen. If server failures are caught gracefully, users understand the problem (e.g. backend off) instead of experiencing a blank page crash.

---

**15. After you add, edit, or delete a product, your on-screen list updates without a page refresh. Explain how — what actually causes React to re-render with the new data?**

*Your answer:*
**Difference between Server State and UI State:**
- **Server State**: The master truth stored on the Express server (in our `products` array in RAM or database).
- **UI State**: The current snapshot of data stored in React component memory (`useState` in `App.jsx`) used to render the screen.

**How we keep them in sync:**
React re-renders components whenever their **state** or **props** change. When an action occurs (Add, Edit, Delete):
1. We first send an HTTP request (`POST`, `PUT`, `DELETE`) to mutate the **Server State**.
2. Once the server confirms success with a `200 OK` or `201 Created` status code and returns the data, we call `setProducts` to update the **UI State**:
   - For Add: `setProducts(prev => [newProduct, ...prev])` updates state with the new item.
   - For Edit: `setProducts(prev => prev.map(...))` replaces the updated product.
   - For Delete: `setProducts(prev => prev.filter(...))` removes the deleted item.

Because `setProducts` modifies React's UI state with the exact result returned from the server, the UI state stays in 1-to-1 sync with the server state without requiring a full browser page reload (F5).

---

**16. What was the hardest part of connecting your React app to your Express API, and what did you do to get past it?**

*Your answer:*
The hardest part was ensuring error handling was consistent between server responses and React state. Specifically, standard `fetch()` doesn't reject its promise on 400 or 404 HTTP status codes.

To resolve this, I created a central `handleResponse` helper function in `client/src/api/products.js`:
```js
async function handleResponse(res) {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.messages?.join(", ") || data?.error || `HTTP ${res.status}`);
  }
  return data;
}
```
This ensured that any non-2xx status code triggers a JavaScript `catch` block on the frontend, allowing forms to surface server validation errors directly to the user.

---

## AI Process

**17. If you used AI to generate any code, how did you break the work into steps or prompts? Give one example of a specific prompt you used, rather than a single "build the whole app" request.**

*Your answer:*
I broke the project into small, modular steps:
1. Backend setup & Express server listening
2. Express Router and 5 CRUD endpoints with in-memory array
3. Middleware (cors, json, logger, error handling)
4. Frontend scaffold with Vite & central API module
5. React UI components and state integration

*Example prompt:*
`"Create an Express Router module in server/routes/products.js containing 5 CRUD routes for an in-memory products array with validation for required fields name and price returning 400 status codes."`

---

**18. Describe one specific thing an AI tool generated that you changed, corrected, or rejected — and why.**

*Your answer:*
The AI initially generated inline route handlers in `server/index.js` using `app.get('/products')` instead of using `express.Router()`.

*What I changed*: I refactored the routes into a dedicated router file (`server/routes/products.js`) and mounted it via `app.use('/products', productsRouter)` in `server/index.js`.
*Why*: Using `express.Router()` keeps code modular, scalable, and cleaner, which fulfills one of the stretch goal best practices.

---

**19. Describe one real bug or error you ran into while building this. How did you actually figure out what was wrong, beyond pasting the error back into the chat?**

*Your answer:*
*Bug*: When submitting the Add Product form, the price was being sent as a string (e.g. `"1200"`) instead of a number, causing the backend validation check `typeof price !== 'number'` to return a 400 error.

*Diagnosis*: I checked VS Code's REST Client test log and browser DevTools Network tab request payload, which showed `"price": "1200"`.

*Fix*: In `ProductForm.jsx`, I wrapped `form.price` in `Number(form.price)` before calling `onSubmit`, ensuring numeric fields are properly typed before sending JSON to the server.

---

**20. Pick one route (backend) or one component (frontend) that AI helped generate. Without looking back at your AI chat history, explain what it does and why it works, in your own words.**

*Your answer:*
*Component*: `ProductForm.jsx`

*What it does*: It renders a form for creating and editing products.

*Why it works*:
1. It handles dual modes (Add vs Edit) using the `editingProduct` prop.
2. It uses `useEffect` to watch `editingProduct`. When a user clicks "Edit", `useEffect` populates form inputs with existing product values. When editing cancels or completes, it resets to blank defaults.
3. On submit, it runs client-side validation first. If valid, it sends parsed numbers (`price`, `quantity`) to `onSubmit`. If the server returns a 400 validation error, it catches the error message in state and renders a red alert box above the form inputs.
