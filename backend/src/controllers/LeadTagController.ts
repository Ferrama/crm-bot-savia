import { Request, Response } from "express";
import AppError from "../errors/AppError";
import Lead from "../models/Lead";

export const store = async (req: Request, res: Response): Promise<Response> => {
  const { leadId } = req.params;
  const { tagId } = req.body;
  const { companyId } = req.user;

  const lead = await Lead.findByPk(leadId);

  if (!lead) {
    throw new AppError("ERR_LEAD_NOT_FOUND", 404);
  }

  if (lead.companyId !== companyId) {
    throw new AppError("ERR_NO_PERMISSION", 403);
  }

  await lead.$add("tags", tagId);

  return res.status(200).json({ message: "Tag added to lead" });
};

export const remove = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { leadId, tagId } = req.params;
  const { companyId } = req.user;

  const lead = await Lead.findByPk(leadId);

  if (!lead) {
    throw new AppError("ERR_LEAD_NOT_FOUND", 404);
  }

  if (lead.companyId !== companyId) {
    throw new AppError("ERR_NO_PERMISSION", 403);
  }

  await lead.$remove("tags", tagId);

  return res.status(200).json({ message: "Tag removed from lead" });
};

export const removeAll = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { leadId } = req.params;
  const { companyId } = req.user;

  const lead = await Lead.findByPk(leadId);

  if (!lead) {
    throw new AppError("ERR_LEAD_NOT_FOUND", 404);
  }

  if (lead.companyId !== companyId) {
    throw new AppError("ERR_NO_PERMISSION", 403);
  }

  await lead.$set("tags", []);

  return res.status(200).json({ message: "All tags removed from lead" });
};
