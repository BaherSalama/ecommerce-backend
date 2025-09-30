import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// GET /products → all products (with optional ?category=Apparel)
app.get("/products", async (req, res) => {
  const { category } = req.query

  const products = await prisma.product.findMany({
    where: category
      ? { categoryId: Number(category) } // ✅ filter by ID
      : {},
    include: { category: true },
  })

  res.json(products)
})
// GET /products/:id → single product
app.get("/products/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
      include: { category: true },
    });

    if (!product) return res.status(404).json({ error: "Product not found" });

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

// POST /products → create new product
app.post("/products", async (req, res) => {
  const { name, price, imageUrl, variants, stock, categoryName } = req.body;

  if (!name || !price || !imageUrl || !categoryName) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // ensure category exists or create it
    const category = await prisma.category.upsert({
      where: { name: categoryName },
      update: {},
      create: { name: categoryName },
    });

    const newProduct = await prisma.product.create({
      data: {
        name,
        price: Number(price),
        imageUrl,
        variants: variants || [], // can be array of strings
        stock: stock ?? 0,
        categoryId: category.id,
      },
      include: { category: true },
    });

    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: "Failed to create product" });
  }
});

// GET /categories → list all categories
app.get("/categories", async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: { products: true },
    });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
