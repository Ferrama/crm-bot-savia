import { Router } from "express";
import * as CurrencyController from "../controllers/CurrencyController";
import isAuth from "../middleware/isAuth";

const currencyRoutes = Router();

currencyRoutes.get("/currencies", isAuth, CurrencyController.index);
currencyRoutes.post("/currencies", isAuth, CurrencyController.store);
currencyRoutes.put("/currencies/:id", isAuth, CurrencyController.update);
currencyRoutes.delete("/currencies/:id", isAuth, CurrencyController.remove);

export default currencyRoutes;
