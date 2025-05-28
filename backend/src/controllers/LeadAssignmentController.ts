import { Request, Response } from "express";
import Interaction from "../models/Interaction";
import Lead from "../models/Lead";
import LeadAssignmentHistory from "../models/LeadAssignmentHistory";
import LeadFollower from "../models/LeadFollower";
import User from "../models/User";
import { InteractionCategory, InteractionType } from "../types/interaction";

const LeadAssignmentController = {
  async assignLead(req: Request, res: Response): Promise<Response> {
    const { leadId } = req.params;
    const { assignedToId, reason } = req.body;

    const lead = await Lead.findByPk(leadId);

    if (!lead) {
      return res.status(404).json({ error: "Lead no encontrado" });
    }

    // Verificar que el usuario existe
    const user = await User.findByPk(assignedToId);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Guardar el usuario anterior antes de actualizar
    const previousAssignedToId = lead.assignedToId;

    // Actualizar la asignación
    await lead.update({ assignedToId });

    // Registrar en el historial
    await LeadAssignmentHistory.create({
      leadId: Number(leadId),
      previousAssignedToId,
      newAssignedToId: Number(assignedToId),
      assignedById: Number(req.user.id),
      reason
    });

    // Registrar la interacción de asignación
    await Interaction.create({
      leadId: Number(leadId),
      type: InteractionType.NOTE,
      category: InteractionCategory.INTERNAL_NOTE,
      notes: `Lead ${previousAssignedToId ? "reasignado" : "asignado"} a ${
        user.name
      }${reason ? ` - Razón: ${reason}` : ""}`,
      userId: Number(req.user.id),
      isPrivate: true
    });

    return res.json(lead);
  },

  async getAssignmentHistory(req: Request, res: Response): Promise<Response> {
    const { leadId } = req.params;
    const { page = "1" } = req.query as { page?: string };
    const limit = 20;
    const offset = (Number(page) - 1) * limit;

    const history = await LeadAssignmentHistory.findAndCountAll({
      where: { leadId: Number(leadId) },
      include: [
        {
          model: User,
          as: "previousAssignedTo",
          attributes: ["id", "name", "email"]
        },
        {
          model: User,
          as: "newAssignedTo",
          attributes: ["id", "name", "email"]
        },
        {
          model: User,
          as: "assignedBy",
          attributes: ["id", "name", "email"]
        }
      ],
      order: [["createdAt", "DESC"]],
      limit,
      offset
    });

    return res.json({
      history: history.rows,
      count: history.count,
      hasMore: history.count > offset + history.rows.length
    });
  },

  async followLead(req: Request, res: Response): Promise<Response> {
    const { leadId } = req.params;
    const { notificationsEnabled = true } = req.body;

    const lead = await Lead.findByPk(leadId);

    if (!lead) {
      return res.status(404).json({ error: "Lead no encontrado" });
    }

    // Verificar si ya está siguiendo el lead
    const existingFollower = await LeadFollower.findOne({
      where: {
        leadId,
        userId: req.user.id
      }
    });

    if (existingFollower) {
      await existingFollower.update({ notificationsEnabled });
      return res.json(existingFollower);
    }

    // Crear nuevo seguidor
    const follower = await LeadFollower.create({
      leadId: Number(leadId),
      userId: Number(req.user.id),
      notificationsEnabled
    });

    // Registrar la interacción
    const currentUser = await User.findByPk(req.user.id);
    await Interaction.create({
      leadId: Number(leadId),
      type: InteractionType.NOTE,
      category: InteractionCategory.INTERNAL_NOTE,
      notes: `${currentUser?.name || "Usuario"} comenzó a seguir este lead`,
      userId: Number(req.user.id),
      isPrivate: true
    });

    return res.status(201).json(follower);
  },

  async unfollowLead(req: Request, res: Response): Promise<Response> {
    const { leadId } = req.params;

    const follower = await LeadFollower.findOne({
      where: {
        leadId,
        userId: req.user.id
      }
    });

    if (!follower) {
      return res.status(404).json({ error: "No estás siguiendo este lead" });
    }

    await follower.destroy();

    // Registrar la interacción
    const lead = await Lead.findByPk(leadId);
    if (lead) {
      const currentUser = await User.findByPk(req.user.id);
      await Interaction.create({
        leadId: Number(leadId),
        type: InteractionType.NOTE,
        category: InteractionCategory.INTERNAL_NOTE,
        notes: `${currentUser?.name || "Usuario"} dejó de seguir este lead`,
        userId: Number(req.user.id),
        isPrivate: true
      });
    }

    return res.status(200).json({ message: "Dejaste de seguir el lead" });
  },

  async getLeadFollowers(req: Request, res: Response): Promise<Response> {
    const { leadId } = req.params;

    const followers = await LeadFollower.findAll({
      where: { leadId },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email"]
        }
      ]
    });

    return res.json(followers);
  },

  async getFollowedLeads(req: Request, res: Response): Promise<Response> {
    const { page = "1" } = req.query as { page?: string };
    const limit = 20;
    const offset = (Number(page) - 1) * limit;

    const followedLeads = await Lead.findAndCountAll({
      include: [
        {
          model: LeadFollower,
          as: "followers",
          where: { userId: req.user.id },
          required: true
        },
        {
          model: User,
          as: "assignedTo",
          attributes: ["id", "name"]
        }
      ],
      limit,
      offset,
      order: [["updatedAt", "DESC"]]
    });

    return res.json({
      leads: followedLeads.rows,
      count: followedLeads.count,
      hasMore: followedLeads.count > offset + followedLeads.rows.length
    });
  }
};

export default LeadAssignmentController;
