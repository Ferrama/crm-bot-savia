import { Request, Response } from "express";
import { Op } from "sequelize";
import * as Yup from "yup";
import AppError from "../errors/AppError";
import { getIO } from "../libs/socket";
import Contact from "../models/Contact";
import Lead from "../models/Lead";
import Ticket from "../models/Ticket";
import User from "../models/User";

interface LeadData {
  contactId: number;
  stage: string;
  temperature: string;
  source: string;
  expectedValue: number;
  probability: number;
  expectedClosingDate: Date;
  assignedToId: number;
  notes: string;
  customFields: Record<string, unknown>;
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
        { "$contact.name$": { [Op.like]: `%${searchParam}%` } },
        { "$contact.number$": { [Op.like]: `%${searchParam}%` } },
        { "$contact.email$": { [Op.like]: `%${searchParam}%` } }
      ]
    })
  };

  const limit = 20;
  const offset = limit * (+pageNumber - 1);

  const { count, rows: leads } = await Lead.findAndCountAll({
    where: whereCondition,
    limit,
    offset,
    order: [["createdAt", "DESC"]],
    include: [
      { model: Contact, as: "contact" },
      { model: User, as: "assignedTo", attributes: ["id", "name"] }
    ]
  });

  return res.json({ leads, count, hasMore: count > offset + leads.length });
};

export const store = async (req: Request, res: Response): Promise<Response> => {
  const { companyId } = req.user;
  const data = req.body as LeadData;

  const schema = Yup.object().shape({
    contactId: Yup.number().required(),
    stage: Yup.string().required(),
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

  const contact = await Contact.findOne({
    where: { id: data.contactId, companyId }
  });

  if (!contact) {
    throw new AppError("Contact not found");
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

  const leadReloaded = await Lead.findByPk(lead.id, {
    include: [
      { model: Contact, as: "contact" },
      { model: User, as: "assignedTo", attributes: ["id", "name"] }
    ]
  });

  const io = getIO();
  io.emit(`lead:${companyId}`, {
    action: "create",
    lead: leadReloaded
  });

  return res.status(200).json(leadReloaded);
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
    stage: Yup.string(),
    temperature: Yup.string(),
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

  if (data.assignedToId) {
    const user = await User.findOne({
      where: { id: data.assignedToId, companyId }
    });

    if (!user) {
      throw new AppError("User not found");
    }
  }

  await lead.update(data);

  const leadReloaded = await Lead.findByPk(id, {
    include: [
      { model: Contact, as: "contact" },
      { model: User, as: "assignedTo", attributes: ["id", "name"] }
    ]
  });

  const io = getIO();
  io.emit(`lead:${companyId}`, {
    action: "update",
    lead: leadReloaded
  });

  return res.status(200).json(leadReloaded);
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
