import { Router } from "express";
import QuoteController from "../controllers/QuoteController";
import isAuth from "../middleware/isAuth";

const quoteRoutes = Router();

quoteRoutes.get("/quotes", isAuth, QuoteController.index);
quoteRoutes.get("/quotes/:id", isAuth, QuoteController.show);
quoteRoutes.post("/quotes", isAuth, QuoteController.store);
quoteRoutes.put("/quotes/:id", isAuth, QuoteController.update);
quoteRoutes.delete("/quotes/:id", isAuth, QuoteController.delete);
quoteRoutes.put("/quotes/:id/status", isAuth, QuoteController.updateStatus);

export default quoteRoutes;
