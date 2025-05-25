import { Router } from "express";
import * as LeadController from "../controllers/LeadController";
import isAuth from "../middleware/isAuth";

const leadRoutes = Router();

leadRoutes.get("/leads", isAuth, LeadController.index);

leadRoutes.get("/leads/:id", isAuth, LeadController.show);

leadRoutes.post("/leads", isAuth, LeadController.store);

leadRoutes.put("/leads/:id", isAuth, LeadController.update);

leadRoutes.delete("/leads/:id", isAuth, LeadController.remove);

export default leadRoutes;
