import express from "express";
import ProductManager from "../functions/productManager.js";

export const productsRouter = express.Router();

const productManager = new ProductManager("db/products.json");

// GET con limit

productsRouter.get("/", async (req, res) => {
  try {
    const limit = req.query.limit;
    const products = await productManager.getProducts();

    if (limit) {
      const limitedProducts = products.slice(0, parseInt(limit));
      res.json(limitedProducts);
    } else {
      res.json(products);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET por ID

productsRouter.get("/:pid", async (req, res) => {
  try {
    const id = req.params.pid;
    const product = await productManager.getProductById(parseInt(id));

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Producto no encontrado" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST 
productsRouter.post("/", async (req, res) => {
  try {
    const product = req.body;
    await productManager.addProduct(product);
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /:pid
productsRouter.put("/:pid", async (req, res) => {
  try {
    const id = req.params.pid;
    const updatedProduct = req.body;
    await productManager.updateProduct(parseInt(id), updatedProduct);
    res.json({ message: `Producto ${id} actualizado` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /:pid
productsRouter.delete("/:pid", async (req, res) => {
  try {
    const id = req.params.pid;
    productManager.deleteProduct(parseInt(id));
    res.json({ message: `Producto ${id} eliminado` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});