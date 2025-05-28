import { Router } from "express";
import QuoteTemplateController from "../controllers/QuoteTemplateController";
import isAuth from "../middleware/isAuth";

const quoteTemplateRoutes = Router();

quoteTemplateRoutes.get(
  "/quote-templates",
  isAuth,
  QuoteTemplateController.index
);
quoteTemplateRoutes.get(
  "/quote-templates/:id",
  isAuth,
  QuoteTemplateController.show
);
quoteTemplateRoutes.post(
  "/quote-templates",
  isAuth,
  QuoteTemplateController.store
);
quoteTemplateRoutes.put(
  "/quote-templates/:id",
  isAuth,
  QuoteTemplateController.update
);
quoteTemplateRoutes.delete(
  "/quote-templates/:id",
  isAuth,
  QuoteTemplateController.delete
);

export default quoteTemplateRoutes;
