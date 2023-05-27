import express from "express";
import CartManager from "../functions/cartManager.js";

export const cartsRouter = express.Router();

const cartManager = new CartManager("db/carts.json");

// GET todos los carritos

cartsRouter.get("/", async (req, res) => {
  try {
    const carts = await cartManager.getCarts();

    if (carts) {
      res.json(carts);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST

cartsRouter.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /:cid

cartsRouter.get("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await cartManager.getCartById(parseInt(cartId));

    if (cart) {
      res.json(cart.products);
    } else {
      res.status(404).json({ message: `Carrito ${cartId} no encontrado` });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /:cid/product/:pid

cartsRouter.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);

    // Verificar si el carrito existe
    const cart = await cartManager.getCartById(cartId);
    if (!cart) {
      return res.status(404).json({ message: `Carrito ${cartId} no encontrado` });
    }

    // Verificar si el producto existe
    const product = await cartManager.getProductById(productId);
    if (!product) {
      return res.status(404).json({ message: `Producto ${productId} no encontrado` });
    }

    await cartManager.addProductToCart(cartId, productId);
    res.json({ message: `Producto ${productId} agregado al carrito ${cartId}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
