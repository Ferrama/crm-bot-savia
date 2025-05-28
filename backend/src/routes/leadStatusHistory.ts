import { Router } from "express";
import LeadStatusHistoryController from "../controllers/LeadStatusHistoryController";
import isAuth from "../middleware/isAuth";

const leadStatusHistoryRoutes = Router();

leadStatusHistoryRoutes.get(
  "/lead-status-history",
  isAuth,
  LeadStatusHistoryController.index
);

leadStatusHistoryRoutes.post(
  "/lead-status-history/:leadId",
  isAuth,
  LeadStatusHistoryController.store
);

leadStatusHistoryRoutes.get(
  "/lead-status-history/:leadId/timeline",
  isAuth,
  LeadStatusHistoryController.getLeadTimeline
);

export default leadStatusHistoryRoutes;
