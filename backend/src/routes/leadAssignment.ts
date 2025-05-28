import { Router } from "express";
import LeadAssignmentController from "../controllers/LeadAssignmentController";
import isAuth from "../middleware/isAuth";

const router = Router();

// Todas las rutas requieren autenticación
router.use(isAuth);

// Asignar lead a un usuario
router.post("/leads/:leadId/assign", LeadAssignmentController.assignLead);

// Seguir/Dejar de seguir un lead
router.post("/leads/:leadId/follow", LeadAssignmentController.followLead);
router.delete("/leads/:leadId/follow", LeadAssignmentController.unfollowLead);

// Obtener seguidores de un lead
router.get(
  "/leads/:leadId/followers",
  LeadAssignmentController.getLeadFollowers
);

// Obtener leads que sigue el usuario actual
router.get("/leads/followed", LeadAssignmentController.getFollowedLeads);

// Obtener historial de asignaciones de un lead
router.get(
  "/leads/:leadId/assignment-history",
  LeadAssignmentController.getAssignmentHistory
);

export default router;
