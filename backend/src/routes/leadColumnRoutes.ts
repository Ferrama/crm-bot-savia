import { Router } from "express";
import * as LeadColumnController from "../controllers/LeadColumnController";
import isAuth from "../middleware/isAuth";

const leadColumnRoutes = Router();

leadColumnRoutes.get("/lead-columns", isAuth, LeadColumnController.index);

leadColumnRoutes.post("/lead-columns", isAuth, LeadColumnController.store);

leadColumnRoutes.put("/lead-columns/:id", isAuth, LeadColumnController.update);

leadColumnRoutes.delete(
  "/lead-columns/:id",
  isAuth,
  LeadColumnController.remove
);

leadColumnRoutes.post(
  "/lead-columns/reorder",
  isAuth,
  LeadColumnController.reorder
);

export default leadColumnRoutes;
