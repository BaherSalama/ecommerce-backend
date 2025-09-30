# how to run
```bash
npm install
npx prisma migrate dev --name init
npx prisma generate
npm run dev
```

# E-Commerce API Documentation

## Base URL
```
http://localhost:4000
```

## Endpoints

### Products

#### Get All Products
Retrieve all products with optional category filtering.

```http
GET /products
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `category` | number | No | Filter products by category ID |

**Success Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Classic T-Shirt",
    "price": 29.99,
    "imageUrl": "https://example.com/tshirt.jpg",
    "variants": ["S", "M", "L", "XL"],
    "stock": 100,
    "categoryId": 1,
    "category": {
      "id": 1,
      "name": "Apparel"
    }
  }
]
```

**Example Requests:**
```bash
# Get all products
curl http://localhost:4000/products

# Get products in category 1
curl http://localhost:4000/products?category=1
```

---

#### Get Single Product
Retrieve a specific product by ID.

```http
GET /products/:id
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number | Yes | Product ID |

**Success Response (200 OK):**
```json
{
  "id": 1,
  "name": "Classic T-Shirt",
  "price": 29.99,
  "imageUrl": "https://example.com/tshirt.jpg",
  "variants": ["S", "M", "L", "XL"],
  "stock": 100,
  "categoryId": 1,
  "category": {
    "id": 1,
    "name": "Apparel"
  }
}
```

**Error Responses:**
- `404 Not Found` - Product doesn't exist
```json
{
  "error": "Product not found"
}
```

- `500 Internal Server Error` - Server error
```json
{
  "error": "Failed to fetch product"
}
```

**Example Request:**
```bash
curl http://localhost:4000/products/1
```

---

#### Create Product
Create a new product.

```http
POST /products
```

**Request Body:**
```json
{
  "name": "Classic T-Shirt",
  "price": 29.99,
  "imageUrl": "https://example.com/tshirt.jpg",
  "variants": ["S", "M", "L", "XL"],
  "stock": 100,
  "categoryName": "Apparel"
}
```

**Body Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | Yes | Product name |
| `price` | number | Yes | Product price |
| `imageUrl` | string | Yes | URL to product image |
| `categoryName` | string | Yes | Category name (will be created if doesn't exist) |
| `variants` | string[] | No | Product variants (e.g., sizes, colors) |
| `stock` | number | No | Stock quantity (defaults to 0) |

**Success Response (201 Created):**
```json
{
  "id": 1,
  "name": "Classic T-Shirt",
  "price": 29.99,
  "imageUrl": "https://example.com/tshirt.jpg",
  "variants": ["S", "M", "L", "XL"],
  "stock": 100,
  "categoryId": 1,
  "category": {
    "id": 1,
    "name": "Apparel"
  }
}
```

**Error Responses:**
- `400 Bad Request` - Missing required fields
```json
{
  "error": "Missing required fields"
}
```

- `500 Internal Server Error` - Server error
```json
{
  "error": "Failed to create product"
}
```

**Example Request:**
```bash
curl -X POST http://localhost:4000/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Classic T-Shirt",
    "price": 29.99,
    "imageUrl": "https://example.com/tshirt.jpg",
    "variants": ["S", "M", "L", "XL"],
    "stock": 100,
    "categoryName": "Apparel"
  }'
```

---

### Categories

#### Get All Categories
Retrieve all categories with their products.

```http
GET /categories
```

**Success Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Apparel",
    "products": [
      {
        "id": 1,
        "name": "Classic T-Shirt",
        "price": 29.99,
        "imageUrl": "https://example.com/tshirt.jpg",
        "variants": ["S", "M", "L", "XL"],
        "stock": 100,
        "categoryId": 1
      }
    ]
  },
  {
    "id": 2,
    "name": "Electronics",
    "products": []
  }
]
```

**Error Response:**
- `500 Internal Server Error` - Server error
```json
{
  "error": "Failed to fetch categories"
}
```

**Example Request:**
```bash
curl http://localhost:4000/categories
```

---

## Data Models

### Product
```typescript
{
  id: number
  name: string
  price: number
  imageUrl: string
  variants: string[]
  stock: number
  categoryId: number
  category: Category
}
```

### Category
```typescript
{
  id: number
  name: string
  products?: Product[]
}
```

---

## Error Handling

All error responses follow this format:
```json
{
  "error": "Error message description"
}
```

### Status Codes
| Status Code | Description |
|-------------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input |
| 404 | Not Found - Resource doesn't exist |
| 500 | Internal Server Error - Server error |

---

## Notes

- The API automatically creates categories if they don't exist when creating a product
- Categories are referenced by ID when filtering products, but by name when creating products
- Variants are stored as an array of strings
- Stock defaults to 0 if not provided
- All numeric IDs are auto-generated by the database
