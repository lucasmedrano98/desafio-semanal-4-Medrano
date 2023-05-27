import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import { cartsRouter } from "./routes/carts.router.js";
import { productsRouter } from "./routes/products.router.js";
import { home } from "./routes/home.router.js";
import { realTimeProducts } from "./routes/realtimeproducts.router.js";
import { __dirname } from "./utils.js";
import ProductManager from "./functions/productManager.js";

const app = express();
const PORT = 8080;

const productManager = new ProductManager("db/products.json");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

//CONFIG DEL MOTOR DE PLANTILLAS
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

//CONFIG DE SOCKET.IO
const httpServer = app.listen(PORT, () => {
  console.log(`Example app listening http://localhost:${PORT}`);
});

const socketServer = new Server(httpServer);

socketServer.on("connection", (socket) => {
  console.log(`New clinet: ${socket.id}`);

  socket.on("new-product", async (newProd) => {
    try {
      await productManager.addProduct({ ...newProd });

      // Actualizar lista después de agregar producto
      const productsList = await productManager.getProducts();
      console.log(productsList);
      socketServer.emit("products", productsList);
    } catch (err) {
      console.log(err);
    }
  });

  socket.on("delete-product", async (productId) => {
    try {
      await productManager.deleteProduct(productId);
  
      // Actualizar lista después de eliminar producto
      const productsList = await productManager.getProducts();
      console.log(productsList);
      socketServer.emit("products", productsList);
    } catch (err) {
      console.log(err);
    }
  });
});

//TODOS MIS ENDPOINTS
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/home", home);
app.use("/realtimeproducts", realTimeProducts);

//OTROS ENDPOINTS
app.get("*", (req, res) => {
  return res
    .status(404)
    .json({ status: "error", msg: "No se encuentra esa ruta", data: {} });
});
