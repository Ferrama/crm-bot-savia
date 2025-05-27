import express from "express";
import * as LeadTagController from "../controllers/LeadTagController";
import isAuth from "../middleware/isAuth";

const leadTagRoutes = express.Router();

leadTagRoutes.post("/leads/:leadId/tags", isAuth, LeadTagController.store);

leadTagRoutes.delete(
  "/leads/:leadId/tags/:tagId",
  isAuth,
  LeadTagController.remove
);

leadTagRoutes.delete(
  "/leads/:leadId/tags",
  isAuth,
  LeadTagController.removeAll
);

export default leadTagRoutes;
