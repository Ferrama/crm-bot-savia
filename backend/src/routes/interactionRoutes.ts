import { Router } from "express";
import InteractionController from "../controllers/InteractionController";
import isAuth from "../middleware/isAuth";

const interactionRoutes = Router();

interactionRoutes.get("/interactions", isAuth, InteractionController.index);
interactionRoutes.post("/interactions", isAuth, InteractionController.store);
interactionRoutes.get(
  "/interactions/follow-ups",
  isAuth,
  InteractionController.getUpcomingFollowUps
);

export default interactionRoutes;
