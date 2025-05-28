import { Request, Response } from "express";
import { Op } from "sequelize";
import QuoteTemplate from "../models/QuoteTemplate";
import User from "../models/User";

const QuoteTemplateController = {
  async index(req: Request, res: Response): Promise<Response> {
    const { searchParam, page = "1" } = req.query as {
      searchParam?: string;
      page?: string;
    };
    const limit = 20;
    const offset = (Number(page) - 1) * limit;

    const whereCondition = searchParam
      ? {
          [Op.or]: [
            { name: { [Op.like]: `%${searchParam}%` } },
            { description: { [Op.like]: `%${searchParam}%` } }
          ]
        }
      : {};

    const templates = await QuoteTemplate.findAndCountAll({
      where: {
        ...whereCondition,
        [Op.or]: [{ isPublic: true }, { createdById: req.user.id }]
      },
      limit,
      offset,
      order: [["createdAt", "DESC"]],
      include: [{ model: User, as: "createdBy", attributes: ["id", "name"] }]
    });

    return res.json({
      templates: templates.rows,
      count: templates.count,
      hasMore: templates.count > offset + templates.rows.length
    });
  },

  async store(req: Request, res: Response): Promise<Response> {
    const {
      name,
      description,
      services,
      defaultTerms,
      defaultTravelDetails,
      isPublic
    } = req.body;

    const template = await QuoteTemplate.create({
      name,
      description,
      services,
      defaultTerms,
      defaultTravelDetails,
      isPublic,
      createdById: Number(req.user.id)
    });

    return res.status(200).json(template);
  },

  async show(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const template = await QuoteTemplate.findByPk(id, {
      include: [{ model: User, as: "createdBy", attributes: ["id", "name"] }]
    });

    if (!template) {
      return res.status(404).json({ error: "Plantilla no encontrada" });
    }

    if (!template.isPublic && template.createdById !== Number(req.user.id)) {
      return res
        .status(403)
        .json({ error: "No tienes permiso para ver esta plantilla" });
    }

    return res.json(template);
  },

  async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const {
      name,
      description,
      services,
      defaultTerms,
      defaultTravelDetails,
      isPublic
    } = req.body;

    const template = await QuoteTemplate.findByPk(id);

    if (!template) {
      return res.status(404).json({ error: "Plantilla no encontrada" });
    }

    if (template.createdById !== Number(req.user.id)) {
      return res
        .status(403)
        .json({ error: "No tienes permiso para modificar esta plantilla" });
    }

    await template.update({
      name,
      description,
      services,
      defaultTerms,
      defaultTravelDetails,
      isPublic
    });

    return res.json(template);
  },

  async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const template = await QuoteTemplate.findByPk(id);

    if (!template) {
      return res.status(404).json({ error: "Plantilla no encontrada" });
    }

    if (template.createdById !== Number(req.user.id)) {
      return res
        .status(403)
        .json({ error: "No tienes permiso para eliminar esta plantilla" });
    }

    await template.destroy();

    return res.status(200).json({ message: "Plantilla eliminada" });
  }
};

export default QuoteTemplateController;
