import { Request, Response } from "express";
import Yup from "yup";
import AppError from "../errors/AppError";
import { getIO } from "../libs/socket";
import Lead from "../models/Lead";
import LeadStatusHistory from "../models/LeadStatusHistory";
import User from "../models/User";
import { ActivityType, LeadPipeline, LeadStatus } from "../types/lead";

const LeadStatusHistoryController = {
  async index(req: Request, res: Response): Promise<Response> {
    const {
      leadId,
      page = "1",
      activityType
    } = req.query as {
      leadId?: string;
      page?: string;
      activityType?: ActivityType;
    };

    const limit = 20;
    const offset = (Number(page) - 1) * limit;

    const whereCondition: any = {};

    if (leadId) {
      whereCondition.leadId = leadId;
    }

    if (activityType) {
      whereCondition.activityType = activityType;
    }

    const history = await LeadStatusHistory.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
      include: [
        { model: User, as: "user", attributes: ["id", "name"] },
        {
          model: Lead,
          as: "lead",
          attributes: ["id", "name", "status", "pipeline"]
        }
      ]
    });

    return res.json({
      history: history.rows,
      count: history.count,
      hasMore: history.count > offset + history.rows.length
    });
  },

  async store(req: Request, res: Response): Promise<Response> {
    const { leadId } = req.params;
    const { activityType, status, pipeline, notes, interactionId, metadata } =
      req.body;

    // Definir los esquemas de validación para cada tipo de actividad
    const emailSchema = Yup.object().shape({
      email: Yup.object().shape({
        from: Yup.string().required(),
        to: Yup.string().required(),
        subject: Yup.string(),
        body: Yup.string()
      })
    });

    const fileSchema = Yup.object().shape({
      file: Yup.object().shape({
        name: Yup.string().required(),
        url: Yup.string().required(),
        type: Yup.string().required(),
        size: Yup.number().required()
      })
    });

    const messageSchema = Yup.object().shape({
      message: Yup.object().shape({
        platform: Yup.string().required(),
        direction: Yup.string().oneOf(["in", "out"]).required(),
        content: Yup.string().required()
      })
    });

    const schema = Yup.object().shape({
      activityType: Yup.string()
        .oneOf(Object.values(ActivityType))
        .required("Activity type is required"),
      status: Yup.string().when("activityType", {
        is: ActivityType.STATUS_CHANGE,
        then: () =>
          Yup.string()
            .oneOf(Object.values(LeadStatus))
            .required("Status is required for status change")
      }),
      pipeline: Yup.string().when("activityType", {
        is: ActivityType.PIPELINE_CHANGE,
        then: () =>
          Yup.string()
            .oneOf(Object.values(LeadPipeline))
            .required("Pipeline is required for pipeline change")
      }),
      notes: Yup.string(),
      interactionId: Yup.number(),
      metadata: Yup.object().when("activityType", ([type]) => {
        switch (type) {
          case ActivityType.EMAIL:
            return emailSchema;
          case ActivityType.FILE:
            return fileSchema;
          case ActivityType.MESSAGE:
            return messageSchema;
          default:
            return Yup.object();
        }
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

    const historyData: any = {
      leadId: Number(leadId),
      activityType,
      notes,
      interactionId,
      metadata,
      userId: req.user.id
    };

    // Manejar diferentes tipos de actividad
    switch (activityType) {
      case ActivityType.STATUS_CHANGE:
        if (!status) {
          throw new AppError("Status is required for status change");
        }
        historyData.status = status;
        historyData.previousStatus = lead.getDataValue("status");
        await lead.update({ status });
        break;

      case ActivityType.PIPELINE_CHANGE:
        if (!pipeline) {
          throw new AppError("Pipeline is required for pipeline change");
        }
        historyData.pipeline = pipeline;
        historyData.previousPipeline = lead.getDataValue("pipeline");
        await lead.update({ pipeline });
        break;

      case ActivityType.EMAIL:
      case ActivityType.NOTE:
      case ActivityType.FILE:
      case ActivityType.MESSAGE:
        // No se requiere actualización del lead
        break;

      default:
        throw new AppError("Invalid activity type");
    }

    // Crear el registro en el historial
    const statusHistory = await LeadStatusHistory.create(historyData);

    // Emitir evento de socket para actualización en tiempo real
    const io = getIO();
    io.emit(`lead:${lead.getDataValue("companyId")}`, {
      action: "activity_update",
      lead: {
        ...lead.toJSON(),
        lastActivity: statusHistory
      }
    });

    return res.status(201).json(statusHistory);
  },

  async getLeadTimeline(req: Request, res: Response): Promise<Response> {
    const { leadId } = req.params;
    const { page = "1" } = req.query as { page?: string };

    const limit = 50;
    const offset = (Number(page) - 1) * limit;

    const history = await LeadStatusHistory.findAll({
      where: { leadId: Number(leadId) },
      order: [["createdAt", "DESC"]],
      include: [
        { model: User, as: "user", attributes: ["id", "name"] },
        {
          model: Lead,
          as: "lead",
          attributes: ["id", "name", "status", "pipeline"]
        }
      ]
    });

    // Formatear la línea de tiempo
    const timeline = history.map(item => {
      let description = "";
      let icon = "";

      switch (item.activityType) {
        case ActivityType.STATUS_CHANGE:
          description = `Updated Stage: ${item.previousStatus || "Empty"} → ${
            item.status
          }`;
          icon = "🔄";
          break;

        case ActivityType.PIPELINE_CHANGE:
          description = `Updated Pipeline: ${
            item.previousPipeline || "Empty"
          } → ${item.pipeline}`;
          icon = "📊";
          break;

        case ActivityType.EMAIL:
          description = `Email: ${
            item.metadata?.email?.subject || "No subject"
          }`;
          icon = "📧";
          break;

        case ActivityType.NOTE:
          description = item.notes || "Note";
          icon = "📝";
          break;

        case ActivityType.FILE:
          description = `File: ${item.metadata?.file?.name || "Unnamed file"}`;
          icon = "📎";
          break;

        case ActivityType.MESSAGE:
          description = `${item.metadata?.message?.platform}: ${item.metadata?.message?.content}`;
          icon = "💬";
          break;

        default:
          description = "Unknown activity";
          icon = "❓";
          break;
      }

      return {
        id: item.id,
        type: item.activityType,
        description,
        icon,
        user: item.user,
        metadata: item.metadata,
        createdAt: item.createdAt,
        notes: item.notes
      };
    });

    // Paginar los resultados
    const paginatedTimeline = timeline.slice(offset, offset + limit);

    return res.json({
      timeline: paginatedTimeline,
      count: timeline.length,
      hasMore: timeline.length > offset + limit
    });
  }
};

export default LeadStatusHistoryController;
