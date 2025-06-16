import { Request, Response } from "express";
import { Op } from "sequelize";
import Yup from "yup";
import AppError from "../errors/AppError";
import { getIO } from "../libs/socket";
import Contact from "../models/Contact";
import Interaction from "../models/Interaction";
import Lead from "../models/Lead";
import User from "../models/User";
import {
  InteractionCategory,
  InteractionPriority,
  InteractionType
} from "../types/interaction";

const InteractionController = {
  async index(req: Request, res: Response): Promise<Response> {
    const {
      leadId,
      page = "1",
      category,
      priority,
      type,
      isPrivate,
      searchParam
    } = req.query as {
      leadId?: string;
      page?: string;
      category?: InteractionCategory;
      priority?: InteractionPriority;
      type?: InteractionType;
      isPrivate?: string;
      searchParam?: string;
    };

    const limit = 20;
    const offset = (Number(page) - 1) * limit;

    const whereCondition: any = {};

    if (leadId) {
      whereCondition.leadId = leadId;
    }

    if (category) {
      whereCondition.category = category;
    }

    if (priority) {
      whereCondition.priority = priority;
    }

    if (type) {
      whereCondition.type = type;
    }

    if (isPrivate !== undefined) {
      whereCondition.isPrivate = isPrivate === "true";
    }

    // Si hay un término de búsqueda, buscar en las notas
    if (searchParam) {
      whereCondition.notes = {
        [Op.like]: `%${searchParam}%`
      };
    }

    const interactions = await Interaction.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Lead,
          as: "lead",
          include: [{ model: Contact, as: "contact" }]
        },
        { model: User, as: "user", attributes: ["id", "name"] }
      ]
    });

    return res.json({
      interactions: interactions.rows,
      count: interactions.count,
      hasMore: interactions.count > offset + interactions.rows.length
    });
  },

  async store(req: Request, res: Response): Promise<Response> {
    const { leadId } = req.params;
    const {
      type,
      category,
      notes,
      priority,
      tags,
      attachments,
      isPrivate,
      nextFollowUp,
      messageData
    } = req.body;

    const schema = Yup.object().shape({
      type: Yup.string().oneOf(Object.values(InteractionType)).required(),
      category: Yup.string()
        .oneOf(Object.values(InteractionCategory))
        .required(),
      notes: Yup.string().when("type", {
        is: InteractionType.MESSAGE,
        then: s => s.required("Message content is required"),
        otherwise: s => s
      }),
      priority: Yup.string().oneOf(Object.values(InteractionPriority)),
      tags: Yup.array().of(Yup.string()),
      attachments: Yup.array().of(
        Yup.object().shape({
          url: Yup.string().required(),
          type: Yup.string().required()
        })
      ),
      isPrivate: Yup.boolean(),
      nextFollowUp: Yup.date(),
      messageData: Yup.object().when("type", {
        is: InteractionType.MESSAGE,
        then: s =>
          s.shape({
            messageId: Yup.string(),
            platform: Yup.string().required(
              "Platform is required for messages"
            ),
            direction: Yup.string()
              .oneOf(["in", "out"])
              .required("Direction is required for messages"),
            status: Yup.string(),
            mediaUrl: Yup.string(),
            mediaType: Yup.string()
          }),
        otherwise: s => s.nullable()
      })
    });

    try {
      await schema.validate(req.body);
    } catch (err) {
      throw new AppError(err.message);
    }

    const lead = await Lead.findByPk(leadId);

    if (!lead) {
      throw new AppError("Lead not found");
    }

    const interaction = await Interaction.create({
      leadId: Number(leadId),
      type,
      category,
      notes,
      priority,
      tags,
      attachments,
      isPrivate,
      nextFollowUp,
      messageData,
      userId: req.user.id
    });

    // Si es un mensaje entrante, actualizar lastContactedAt del lead
    if (type === InteractionType.MESSAGE && messageData?.direction === "in") {
      await lead.update({ lastContactedAt: new Date() });
    }

    // Emitir evento de socket para actualización en tiempo real
    const io = getIO();
    io.emit(`lead:${lead.companyId}`, {
      action: "update",
      lead: {
        ...lead.toJSON(),
        lastInteraction: interaction
      }
    });

    return res.status(201).json(interaction);
  },

  async getUpcomingFollowUps(req: Request, res: Response): Promise<Response> {
    const {
      page = "1",
      priority,
      category
    } = req.query as {
      page?: string;
      priority?: InteractionPriority;
      category?: InteractionCategory;
    };

    const limit = 20;
    const offset = (Number(page) - 1) * limit;

    const whereCondition: any = {
      nextFollowUp: {
        [Op.gte]: new Date()
      }
    };

    if (priority) {
      whereCondition.priority = priority;
    }

    if (category) {
      whereCondition.category = category;
    }

    const interactions = await Interaction.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      order: [["nextFollowUp", "ASC"]],
      include: [
        {
          model: Lead,
          as: "lead",
          include: [{ model: Contact, as: "contact" }]
        },
        { model: User, as: "user", attributes: ["id", "name"] }
      ]
    });

    return res.json({
      interactions: interactions.rows,
      count: interactions.count,
      hasMore: interactions.count > offset + interactions.rows.length
    });
  }
};

export default InteractionController;
