import { Request, Response } from "express";
import { Op } from "sequelize";
import * as Yup from "yup";
import AppError from "../errors/AppError";
import { getIO } from "../libs/socket";
import Contact from "../models/Contact";
import Lead from "../models/Lead";
import LeadColumn from "../models/LeadColumn";
import Ticket from "../models/Ticket";
import User from "../models/User";

interface LeadData {
  name: string;
  contactId: number;
  columnId: number;
  temperature: string;
  source: string;
  expectedValue: number;
  probability: number;
  expectedClosingDate: Date;
  assignedToId: number;
  notes: string;
  customFields: any;
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
      { model: LeadColumn, as: "column", attributes: ["id", "name", "color"] }
    ]
  });

  const hasMore = count > offset + leads.length;

  return res.json({ leads, count, hasMore });
};

export const store = async (req: Request, res: Response): Promise<Response> => {
  const { companyId } = req.user;
  const data = req.body as LeadData;

  const schema = Yup.object().shape({
    name: Yup.string().required(),
    contactId: Yup.number().required(),
    columnId: Yup.number().required(),
    temperature: Yup.string().required(),
    source: Yup.string(),
    expectedValue: Yup.number(),
    probability: Yup.number(),
    expectedClosingDate: Yup.date(),
    assignedToId: Yup.number(),
    notes: Yup.string(),
    customFields: Yup.object()
  });

  try {
    await schema.validate(data);
  } catch (err) {
    throw new AppError(err.message);
  }

  const contact = await Contact.findByPk(data.contactId);

  if (!contact || contact.companyId !== companyId) {
    throw new AppError("Contact not found");
  }

  const column = await LeadColumn.findOne({
    where: { id: data.columnId, companyId }
  });

  if (!column) {
    throw new AppError("Lead column not found");
  }

  if (data.assignedToId) {
    const user = await User.findOne({
      where: { id: data.assignedToId, companyId }
    });

    if (!user) {
      throw new AppError("User not found");
    }
  }

  const lead = await Lead.create({
    ...data,
    companyId
  });

  const io = getIO();
  io.emit(`lead:${companyId}`, {
    action: "create",
    lead
  });

  return res.status(200).json(lead);
};

export const show = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const { companyId } = req.user;

  const lead = await Lead.findByPk(id, {
    include: [
      { model: Contact, as: "contact" },
      { model: User, as: "assignedTo", attributes: ["id", "name"] },
      { model: Ticket, as: "tickets" }
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
  const data = req.body as LeadData;

  const schema = Yup.object().shape({
    name: Yup.string().required(),
    contactId: Yup.number().required(),
    columnId: Yup.number().required(),
    temperature: Yup.string().required(),
    source: Yup.string(),
    expectedValue: Yup.number(),
    probability: Yup.number(),
    expectedClosingDate: Yup.date(),
    assignedToId: Yup.number(),
    notes: Yup.string(),
    customFields: Yup.object()
  });

  try {
    await schema.validate(data);
  } catch (err) {
    throw new AppError(err.message);
  }

  const lead = await Lead.findByPk(id);

  if (!lead || lead.companyId !== companyId) {
    throw new AppError("Lead not found");
  }

  const contact = await Contact.findByPk(data.contactId);

  if (!contact || contact.companyId !== companyId) {
    throw new AppError("Contact not found");
  }

  const column = await LeadColumn.findOne({
    where: { id: data.columnId, companyId }
  });

  if (!column) {
    throw new AppError("Lead column not found");
  }

  if (data.assignedToId) {
    const user = await User.findOne({
      where: { id: data.assignedToId, companyId }
    });

    if (!user) {
      throw new AppError("User not found");
    }
  }

  await lead.update(data);

  const io = getIO();
  io.emit(`lead:${companyId}`, {
    action: "update",
    lead
  });

  return res.status(200).json(lead);
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
