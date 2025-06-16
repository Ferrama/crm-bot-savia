import express from "express";
import * as LeadColumnController from "../controllers/LeadColumnController";
import isAuth from "../middleware/isAuth";

const leadColumnRoutes = express.Router();

leadColumnRoutes.get("/lead-columns", isAuth, LeadColumnController.index);

leadColumnRoutes.post("/lead-columns", isAuth, LeadColumnController.store);

leadColumnRoutes.put("/lead-columns/:id", isAuth, LeadColumnController.update);

leadColumnRoutes.delete(
  "/lead-columns/:id",
  isAuth,
  LeadColumnController.remove
);

leadColumnRoutes.put(
  "/lead-columns/order",
  isAuth,
  LeadColumnController.updateOrder
);

leadColumnRoutes.get(
  "/lead-columns/defaults",
  isAuth,
  LeadColumnController.getDefaultColumnsConfig
);

leadColumnRoutes.post(
  "/lead-columns/from-default",
  isAuth,
  LeadColumnController.createFromDefault
);

export default leadColumnRoutes;
