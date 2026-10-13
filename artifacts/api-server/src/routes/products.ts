import { Router, type IRouter } from "express";
import { GetProductsResponse } from "@workspace/api-zod";
import { mongoReady } from "../lib/mongo";
import { ProductModel } from "../lib/models";

const router: IRouter = Router();

router.get("/products", async (req, res): Promise<void> => {
  if (!mongoReady()) {
    res.status(503).json({ error: process.env.MONGODB_URI ? "MongoDB Atlas is temporarily unavailable." : "MONGODB_URI_MISSING" });
    return;
  }
  const records = await ProductModel.find().sort({ sortOrder: 1 }).lean();
  const products = records.map(({ _id, __v, sortOrder, createdAt, updatedAt, ...product }) => product);
  res.json(GetProductsResponse.parse(products));
});

export default router;
