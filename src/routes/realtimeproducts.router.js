import express from "express";
import ProductManager from "../functions/productManager.js";

export const realTimeProducts = express.Router();

const productManager = new ProductManager("db/products.json");

// GET con limit

realTimeProducts.get("/", async (req, res) => {
  try {
    const limit = req.query.limit;
    const products = await productManager.getProducts();

    if (limit) {
      const limitedProducts = products.slice(0, parseInt(limit));
      res.status(200).render("realtimeproducts", { limitedProducts });
    } else {
      res.status(200).render("realtimeproducts", { products });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET por ID

realTimeProducts.get("/:pid", async (req, res) => {
  try {
    const id = req.params.pid;
    const productById = await productManager.getProductById(parseInt(id));

    if (productById) {
      res
        .status(200)
        .render("realtimeproducts", { productById: [productById] });
    } else {
      res.status(404).json({ message: "Producto no encontrado" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
