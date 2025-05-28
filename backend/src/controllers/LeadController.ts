import { Request, Response } from "express";
import { Op } from "sequelize";
import * as Yup from "yup";
import AppError from "../errors/AppError";
import { getIO } from "../libs/socket";
import Contact from "../models/Contact";
import Currency from "../models/Currency";
import Interaction, {
    InteractionCategory,
    InteractionType
} from "../models/Interaction";
import Lead from "../models/Lead";
import LeadColumn from "../models/LeadColumn";
import Tag from "../models/Tag";
import Ticket from "../models/Ticket";
import User from "../models/User";

interface LeadData {
  name: string;
  contactId: number;
  columnId: number;
  temperature: string;
  source: string;
  expectedValue: number;
  currencyId: number;
  probability: number;
  expectedClosingDate: Date;
  assignedToId: number;
  notes: string;
  customFields: any;
  tagIds?: number[];
}

export const index = async (req: Request, res: Response): Promise<Response> => {
  const { companyId } = req.user;
  const { searchParam, pageNumber } = req.query as {
    searchParam?: string;
    pageNumber?: string;
  };

  const whereCondition = {
    companyId,
    ...(searchParam && {
      [Op.or]: [
        { name: { [Op.like]: `%${searchParam}%` } },
        { "$contact.name$": { [Op.like]: `%${searchParam}%` } },
        { "$contact.number$": { [Op.like]: `%${searchParam}%` } }
      ]
    })
  };

  const limit = 20;
  const offset = pageNumber ? (Number(pageNumber) - 1) * limit : 0;

  const { count, rows: leads } = await Lead.findAndCountAll({
    where: whereCondition,
    limit,
    offset,
    order: [["createdAt", "DESC"]],
    include: [
      { model: Contact, as: "contact", attributes: ["id", "name", "number"] },
      { model: User, as: "assignedTo", attributes: ["id", "name"] },
      { model: LeadColumn, as: "column", attributes: ["id", "name", "color"] },
      { model: Tag, as: "tagRelations", attributes: ["id", "name", "color"] },
      {
        model: Currency,
        as: "currency",
        attributes: ["id", "code", "symbol", "name"]
      }
    ]
  });

  const hasMore = count > offset + leads.length;

  return res.json({ leads, count, hasMore });
};

export const store = async (req: Request, res: Response): Promise<Response> => {
  const {
    name,
    title,
    description,
    contactId,
    columnId,
    temperature,
    source,
    expectedValue,
    probability,
    expectedClosingDate,
    assignedToId,
    companyId,
    notes,
    customFields,
    currencyId
  } = req.body;

  const schema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    title: Yup.string().max(255, "Title must be at most 255 characters"),
    description: Yup.string(),
    contactId: Yup.number().required("Contact is required"),
    columnId: Yup.number().required("Column is required"),
    temperature: Yup.string().oneOf(["cold", "warm", "hot"]),
    source: Yup.string(),
    expectedValue: Yup.number().min(0),
    probability: Yup.number().min(0).max(100),
    expectedClosingDate: Yup.date(),
    assignedToId: Yup.number(),
    notes: Yup.string(),
    customFields: Yup.object(),
    currencyId: Yup.number().required("Currency is required")
  });

  try {
    await schema.validate(req.body);
  } catch (err) {
    throw new AppError(err.message);
  }

  const contact = await Contact.findByPk(contactId);

  if (!contact || contact.companyId !== companyId) {
    throw new AppError("Contact not found");
  }

  const column = await LeadColumn.findOne({
    where: { id: columnId, companyId }
  });

  if (!column) {
    throw new AppError("Lead column not found");
  }

  const currency = await Currency.findByPk(currencyId);

  if (!currency) {
    throw new AppError("Currency not found");
  }

  if (assignedToId) {
    const user = await User.findOne({
      where: { id: assignedToId, companyId }
    });

    if (!user) {
      throw new AppError("User not found");
    }
  }

  const lead = await Lead.create({
    name,
    title,
    description,
    contactId,
    columnId,
    temperature,
    source,
    expectedValue,
    probability,
    expectedClosingDate,
    assignedToId,
    companyId,
    notes,
    customFields,
    currencyId
  });

  // Registrar la interacción de creación
  await Interaction.create({
    leadId: lead.id,
    type: InteractionType.NOTE,
    category: InteractionCategory.INTERNAL_NOTE,
    notes: `Lead creado${title ? ` con título: ${title}` : ""}`,
    userId: Number(req.user.id),
    isPrivate: true
  });

  const io = getIO();
  io.emit(`lead:${companyId}`, {
    action: "create",
    lead
  });

  return res.status(201).json(lead);
};

export const show = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const { companyId } = req.user;

  const lead = await Lead.findByPk(id, {
    include: [
      { model: Contact, as: "contact" },
      { model: User, as: "assignedTo", attributes: ["id", "name"] },
      { model: Ticket, as: "tickets" },
      { model: Tag, as: "tagRelations", attributes: ["id", "name", "color"] },
      {
        model: Currency,
        as: "currency",
        attributes: ["id", "code", "symbol", "name"]
      }
    ]
  });

  if (!lead || lead.companyId !== companyId) {
    throw new AppError("Lead not found");
  }

  return res.status(200).json(lead);
};

export const update = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;
  const {
    name,
    title,
    description,
    contactId,
    columnId,
    temperature,
    source,
    expectedValue,
    probability,
    expectedClosingDate,
    assignedToId,
    companyId,
    notes,
    customFields,
    currencyId
  } = req.body;

  const schema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    title: Yup.string().max(255, "Title must be at most 255 characters"),
    description: Yup.string(),
    contactId: Yup.number().required("Contact is required"),
    columnId: Yup.number().required("Column is required"),
    temperature: Yup.string().oneOf(["cold", "warm", "hot"]),
    source: Yup.string(),
    expectedValue: Yup.number().min(0),
    probability: Yup.number().min(0).max(100),
    expectedClosingDate: Yup.date(),
    assignedToId: Yup.number(),
    notes: Yup.string(),
    customFields: Yup.object(),
    currencyId: Yup.number().required("Currency is required")
  });

  try {
    await schema.validate(req.body);
  } catch (err) {
    throw new AppError(err.message);
  }

  const lead = await Lead.findByPk(id);

  if (!lead || lead.companyId !== companyId) {
    throw new AppError("Lead not found");
  }

  // Guardar valores anteriores para el registro de cambios
  const oldTitle = lead.title;
  const oldDescription = lead.description;

  await lead.update({
    name,
    title,
    description,
    contactId,
    columnId,
    temperature,
    source,
    expectedValue,
    probability,
    expectedClosingDate,
    assignedToId,
    companyId,
    notes,
    customFields,
    currencyId
  });

  // Registrar cambios en el título o descripción
  if (title !== oldTitle || description !== oldDescription) {
    let changeNote = "Actualización de lead:";
    if (title !== oldTitle) {
      changeNote += `\n- Título cambiado de "${oldTitle || "sin título"}" a "${
        title || "sin título"
      }"`;
    }
    if (description !== oldDescription) {
      changeNote += "\n- Descripción actualizada";
    }

    await Interaction.create({
      leadId: lead.id,
      type: InteractionType.NOTE,
      category: InteractionCategory.INTERNAL_NOTE,
      notes: changeNote,
      userId: Number(req.user.id),
      isPrivate: true
    });
  }

  const io = getIO();
  io.emit(`lead:${companyId}`, {
    action: "update",
    lead
  });

  return res.json(lead);
};

export const remove = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;
  const { companyId } = req.user;

  const lead = await Lead.findByPk(id);

  if (!lead || lead.companyId !== companyId) {
    throw new AppError("Lead not found");
  }

  await lead.destroy();

  const io = getIO();
  io.emit(`lead:${companyId}`, {
    action: "delete",
    leadId: id
  });

  return res.status(200).json({ message: "Lead deleted" });
};

export const moveLead = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { companyId } = req.user;
  const { leadId, columnId } = req.body as { leadId: number; columnId: number };

  const schema = Yup.object().shape({
    leadId: Yup.number().required(),
    columnId: Yup.number().required()
  });

  try {
    await schema.validate(req.body);
  } catch (err) {
    throw new AppError(err.message);
  }

  const lead = await Lead.findOne({
    where: { id: leadId, companyId },
    include: [
      { model: Contact, as: "contact", attributes: ["id", "name", "number"] },
      { model: User, as: "assignedTo", attributes: ["id", "name"] },
      { model: LeadColumn, as: "column", attributes: ["id", "name", "color"] }
    ]
  });

  if (!lead) {
    throw new AppError("Lead not found");
  }

  const column = await LeadColumn.findOne({
    where: { id: columnId, companyId }
  });

  if (!column) {
    throw new AppError("Lead column not found");
  }

  await lead.update({ columnId });

  const io = getIO();
  io.emit(`lead:${companyId}`, {
    action: "update",
    lead
  });

  return res.status(200).json(lead);
};
