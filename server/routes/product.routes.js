import { Router } from "express";
import * as productController from "../controllers/product.controller.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

// Para rutas que requieren sesión, aplicar primero authMiddleware, luego adminMiddleware cuando aplique
router.post("/", authMiddleware, adminMiddleware, productController.createProduct);
router.get("/", productController.getProducts); // listado público
router.get("/featured", productController.getFeaturedProducts); // público
router.get("/:id", productController.getProductById);
router.put("/:id", authMiddleware, adminMiddleware, productController.updateProduct);
router.delete("/:id", authMiddleware, adminMiddleware, productController.deleteProduct);

export default router;
