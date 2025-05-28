import { Request, Response } from "express";
import { Op } from "sequelize";
import Contact from "../models/Contact";
import Currency from "../models/Currency";
import Interaction, { InteractionType } from "../models/Interaction";
import Lead from "../models/Lead";
import Quote, { QuoteStatus } from "../models/Quote";
import User from "../models/User";

const QuoteController = {
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
            { "$lead.name$": { [Op.like]: `%${searchParam}%` } },
            { "$lead.contact.email$": { [Op.like]: `%${searchParam}%` } },
            { "$contact.email$": { [Op.like]: `%${searchParam}%` } }
          ]
        }
      : {};

    const quotes = await Quote.findAndCountAll({
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
        { model: Contact, as: "contact" },
        { model: User, as: "createdBy", attributes: ["id", "name"] },
        { model: Currency, as: "currency" }
      ]
    });

    return res.json({
      quotes: quotes.rows,
      count: quotes.count,
      hasMore: quotes.count > offset + quotes.rows.length
    });
  },

  async store(req: Request, res: Response): Promise<Response> {
    const {
      leadId,
      contactId,
      services,
      terms,
      notes,
      travelDetails,
      validUntil,
      currencyId
    } = req.body;

    const quote = await Quote.create({
      leadId,
      contactId,
      services,
      terms,
      notes,
      travelDetails,
      validUntil,
      currencyId,
      status: QuoteStatus.DRAFT,
      createdById: req.user.id,
      totalAmount: services.reduce(
        (acc: number, service: any) => acc + service.total,
        0
      )
    });

    // Registrar interacción
    await Interaction.create({
      leadId,
      type: InteractionType.QUOTE_SENT,
      notes: "Cotización creada",
      userId: req.user.id
    });

    return res.status(200).json(quote);
  },

  async show(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const quote = await Quote.findByPk(id, {
      include: [
        {
          model: Lead,
          as: "lead",
          include: [{ model: Contact, as: "contact" }]
        },
        { model: Contact, as: "contact" },
        { model: User, as: "createdBy", attributes: ["id", "name"] },
        { model: Currency, as: "currency" }
      ]
    });

    if (!quote) {
      return res.status(404).json({ error: "Cotización no encontrada" });
    }

    return res.json(quote);
  },

  async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const {
      services,
      terms,
      notes,
      travelDetails,
      validUntil,
      currencyId,
      status,
      contactId
    } = req.body;

    const quote = await Quote.findByPk(id);

    if (!quote) {
      return res.status(404).json({ error: "Cotización no encontrada" });
    }

    const oldStatus = quote.status;
    const newStatus = status || quote.status;

    await quote.update({
      services,
      terms,
      notes,
      travelDetails,
      validUntil,
      currencyId,
      status: newStatus,
      contactId,
      totalAmount: services.reduce(
        (acc: number, service: any) => acc + service.total,
        0
      )
    });

    // Registrar cambio de estado si es diferente
    if (oldStatus !== newStatus) {
      await Interaction.create({
        leadId: quote.leadId,
        type: InteractionType.QUOTE_SENT,
        notes: `Estado de cotización cambiado a ${newStatus}`,
        userId: req.user.id
      });
    }

    return res.json(quote);
  },

  async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const quote = await Quote.findByPk(id);

    if (!quote) {
      return res.status(404).json({ error: "Cotización no encontrada" });
    }

    await quote.destroy();

    return res.status(200).json({ message: "Cotización eliminada" });
  },

  async updateStatus(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { status } = req.body;

    const quote = await Quote.findByPk(id);

    if (!quote) {
      return res.status(404).json({ error: "Cotización no encontrada" });
    }

    const oldStatus = quote.status;

    await quote.update({ status });

    // Registrar cambio de estado
    await Interaction.create({
      leadId: quote.leadId,
      type: InteractionType.QUOTE_SENT,
      notes: `Estado de cotización cambiado de ${oldStatus} a ${status}`,
      userId: req.user.id
    });

    return res.json(quote);
  }
};

export default QuoteController;
