import { Request, Response } from "express";
import { getIO } from "../libs/socket";

import AppError from "../errors/AppError";

import CreateService from "../services/ScheduleServices/CreateService";
import DeleteService from "../services/ScheduleServices/DeleteService";
import ListService from "../services/ScheduleServices/ListService";
import ShowService from "../services/ScheduleServices/ShowService";
import UpdateService from "../services/ScheduleServices/UpdateService";

type IndexQuery = {
  searchParam?: string;
  contactId?: number | string;
  userId?: number | string;
  pageNumber?: string | number;
};

export const index = async (req: Request, res: Response): Promise<Response> => {
  const { contactId, userId, pageNumber, searchParam } =
    req.query as IndexQuery;
  const { companyId } = req.user;

  const { schedules, count, hasMore } = await ListService({
    searchParam,
    contactId,
    userId,
    pageNumber,
    companyId
  });

  return res.json({ schedules, count, hasMore });
};

export const store = async (req: Request, res: Response): Promise<Response> => {
  const { body, sendAt, contactId, saveMessage, whatsappId } = req.body;
  const { companyId } = req.user;
  const userId = Number(req.user.id);

  const schedule = await CreateService({
    body,
    sendAt,
    contactId,
    companyId,
    userId,
    saveMessage: !!saveMessage,
    whatsappId
  });

  const io = getIO();
  io.to(`company-${companyId}-mainchannel`).emit(
    `company-${companyId}-schedule`,
    {
      action: "create",
      schedule
    }
  );

  return res.status(200).json(schedule);
};

export const show = async (req: Request, res: Response): Promise<Response> => {
  const { scheduleId } = req.params;
  const { companyId } = req.user;

  const schedule = await ShowService(scheduleId, companyId);

  return res.status(200).json(schedule);
};

export const update = async (
  req: Request,
  res: Response
): Promise<Response> => {
  if (req.user.profile !== "admin") {
    throw new AppError("ERR_NO_PERMISSION", 403);
  }

  const { scheduleId } = req.params;
  const scheduleData = req.body;
  const { companyId } = req.user;

  const schedule = await UpdateService({
    scheduleData,
    id: scheduleId,
    companyId
  });

  const io = getIO();
  io.to(`company-${companyId}-mainchannel`).emit(
    `company-${companyId}-schedule`,
    {
      action: "update",
      schedule
    }
  );

  return res.status(200).json(schedule);
};

export const remove = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { scheduleId } = req.params;
  const { companyId } = req.user;

  await DeleteService(scheduleId, companyId);

  const io = getIO();
  io.emit("schedule", {
    action: "delete",
    scheduleId
  });

  return res.status(200).json({ message: "Schedule deleted" });
};
