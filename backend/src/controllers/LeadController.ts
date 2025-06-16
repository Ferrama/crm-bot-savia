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
import { LeadStatus } from "../types/lead";

// Mapeo de códigos de columna a estados
const columnCodeToStatus = {
  new: LeadStatus.NEW,
  contacted: LeadStatus.CONTACTED,
  follow_up: LeadStatus.FOLLOW_UP,
  proposal: LeadStatus.PROPOSAL,
  negotiation: LeadStatus.NEGOTIATION,
  qualified: LeadStatus.QUALIFIED,
  not_qualified: LeadStatus.UNQUALIFIED,
  converted: LeadStatus.CONVERTED,
  lost: LeadStatus.LOST,
  closed_won: LeadStatus.CLOSED_WON,
  closed_lost: LeadStatus.CLOSED_LOST
};

// Función para obtener el status basado en el columnId
const getStatusFromColumnId = async (
  columnId: number,
  companyId: number
): Promise<string> => {
  const column = await LeadColumn.findOne({
    where: { id: columnId, companyId },
    attributes: ["code"]
  });

  if (column && column.code && columnCodeToStatus[column.code]) {
    return columnCodeToStatus[column.code];
  }

  // Si no se encuentra la columna o no tiene código, devolver "new" por defecto
  return LeadStatus.NEW;
};

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
      {
        model: LeadColumn,
        as: "column",
        attributes: ["id", "name", "color", "code"]
      },
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
    notes,
    customFields,
    currencyId,
    tagIds
  } = req.body;
  const { companyId } = req.user;

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
    notes: Yup.string().max(50000, "Notes must be at most 50,000 characters"),
    customFields: Yup.object(),
    currencyId: Yup.number().required("Currency is required"),
    tagIds: Yup.array().of(Yup.number())
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

  // Validar que todos los tags existan y pertenezcan a la compañía
  if (tagIds && tagIds.length > 0) {
    const tags = await Tag.findAll({
      where: { id: tagIds, companyId }
    });

    if (tags.length !== tagIds.length) {
      throw new AppError("One or more tags not found");
    }
  }

  // Sanitize data - convert empty strings to null for numeric fields
  const sanitizedData = {
    name,
    title: title || null,
    description: description || null,
    contactId,
    columnId,
    temperature,
    source: source || null,
    expectedValue:
      expectedValue === "" ||
      expectedValue === null ||
      expectedValue === undefined
        ? null
        : expectedValue,
    probability:
      probability === "" || probability === null || probability === undefined
        ? null
        : probability,
    expectedClosingDate: expectedClosingDate || null,
    assignedToId:
      assignedToId === "" || assignedToId === null || assignedToId === undefined
        ? null
        : assignedToId,
    companyId,
    notes: notes || null,
    customFields: customFields || {},
    currencyId
  };

  // Obtener el status basado en la columna seleccionada
  const statusFromColumn = await getStatusFromColumnId(columnId, companyId);

  // Agregar el status al objeto de datos
  const leadData = {
    ...sanitizedData,
    status: statusFromColumn
  };

  const lead = await Lead.create(leadData);

  // Asociar tags con el lead
  if (tagIds && tagIds.length > 0) {
    await lead.$add("tagRelations", tagIds);
  }

  // Registrar la interacción de creación
  await Interaction.create({
    leadId: lead.id,
    type: InteractionType.NOTE,
    category: InteractionCategory.INTERNAL_NOTE,
    priority: "medium",
    notes: `Lead creado${title ? ` con título: ${title}` : ""}`,
    tags: [],
    attachments: [],
    userId: Number(req.user.id),
    isPrivate: true
  });

  const io = getIO();
  io.emit(`lead:${companyId}`, {
    action: "create",
    lead
  });

  // Obtener el lead creado con todas las relaciones
  const createdLead = await Lead.findByPk(lead.id, {
    include: [
      { model: Contact, as: "contact" },
      { model: User, as: "assignedTo", attributes: ["id", "name"] },
      { model: Ticket, as: "tickets" },
      { model: Tag, as: "tagRelations", attributes: ["id", "name", "color"] },
      {
        model: Currency,
        as: "currency",
        attributes: ["id", "code", "symbol", "name"]
      },
      {
        model: LeadColumn,
        as: "column",
        attributes: ["id", "name", "color", "code"]
      }
    ]
  });

  return res.status(201).json(createdLead);
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
      },
      {
        model: LeadColumn,
        as: "column",
        attributes: ["id", "name", "color", "code"]
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
  const { companyId } = req.user;
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
    notes,
    customFields,
    currencyId,
    tagIds
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
    notes: Yup.string().max(50000, "Notes must be at most 50,000 characters"),
    customFields: Yup.object(),
    currencyId: Yup.number().required("Currency is required"),
    tagIds: Yup.array().of(Yup.number())
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

  // Validar que todos los tags existan y pertenezcan a la compañía
  if (tagIds && tagIds.length > 0) {
    const tags = await Tag.findAll({
      where: { id: tagIds, companyId }
    });

    if (tags.length !== tagIds.length) {
      throw new AppError("One or more tags not found");
    }
  }

  // Sanitize data - convert empty strings to null for numeric fields
  const sanitizedUpdateData = {
    name,
    title: title || null,
    description: description || null,
    contactId,
    columnId,
    temperature,
    source: source || null,
    expectedValue:
      expectedValue === "" ||
      expectedValue === null ||
      expectedValue === undefined
        ? null
        : expectedValue,
    probability:
      probability === "" || probability === null || probability === undefined
        ? null
        : probability,
    expectedClosingDate: expectedClosingDate || null,
    assignedToId:
      assignedToId === "" || assignedToId === null || assignedToId === undefined
        ? null
        : assignedToId,
    notes: notes || null,
    customFields: customFields || {},
    currencyId
  };

  // Obtener el status basado en la columna seleccionada
  const statusFromColumn = await getStatusFromColumnId(columnId, companyId);

  // Agregar el status al objeto de datos de actualización
  const updateData = {
    ...sanitizedUpdateData,
    status: statusFromColumn
  };

  await lead.update(updateData);

  // Actualizar asociaciones de tags
  if (tagIds !== undefined) {
    await lead.$set("tagRelations", tagIds || []);
  }

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
      priority: "medium",
      notes: changeNote,
      tags: [],
      attachments: [],
      userId: Number(req.user.id),
      isPrivate: true
    });
  }

  const io = getIO();
  io.emit(`lead:${companyId}`, {
    action: "update",
    lead
  });

  // Obtener el lead actualizado con todas las relaciones
  const updatedLead = await Lead.findByPk(id, {
    include: [
      { model: Contact, as: "contact" },
      { model: User, as: "assignedTo", attributes: ["id", "name"] },
      { model: Ticket, as: "tickets" },
      { model: Tag, as: "tagRelations", attributes: ["id", "name", "color"] },
      {
        model: Currency,
        as: "currency",
        attributes: ["id", "code", "symbol", "name"]
      },
      {
        model: LeadColumn,
        as: "column",
        attributes: ["id", "name", "color", "code"]
      }
    ]
  });

  return res.json(updatedLead);
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

  // Obtener el status basado en la nueva columna
  const statusFromColumn = await getStatusFromColumnId(columnId, companyId);

  await lead.update({ columnId, status: statusFromColumn });

  const io = getIO();
  io.emit(`lead:${companyId}`, {
    action: "update",
    lead
  });

  return res.status(200).json(lead);
};
