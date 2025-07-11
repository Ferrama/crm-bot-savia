import { Request, Response } from "express";

import { head } from "lodash";
import fs from "fs";
import path from "path";
import CreateService from "../services/QueueOptionService/CreateService";
import ListService from "../services/QueueOptionService/ListService";
import UpdateService from "../services/QueueOptionService/UpdateService";
import ShowService from "../services/QueueOptionService/ShowService";
import DeleteService from "../services/QueueOptionService/DeleteService";

import AppError from "../errors/AppError";
import QueueOption from "../models/QueueOption";

type FilterList = {
  queueId: string;
  queueOptionId: string;
  parentId: string;
};

export const index = async (req: Request, res: Response): Promise<Response> => {
  const { queueId, queueOptionId, parentId } = req.query as FilterList;

  // Convert the strings to numbers
  const convertedQueueId: number = parseInt(queueId, 10);
  const convertedQueueOptionId = parseInt(queueOptionId, 10);
  const convertedParentId = parseInt(parentId, 10);

  const queueOptions = await ListService({
    queueId: convertedQueueId,
    queueOptionId: convertedQueueOptionId,
    parentId: convertedParentId
  });

  return res.json(queueOptions);
};

export const store = async (req: Request, res: Response): Promise<Response> => {
  const queueOptionData = req.body;

  const queueOption = await CreateService(queueOptionData);

  return res.status(200).json(queueOption);
};

export const show = async (req: Request, res: Response): Promise<Response> => {
  const { queueOptionId } = req.params;

  const queueOption = await ShowService(queueOptionId);

  return res.status(200).json(queueOption);
};

export const update = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { queueOptionId } = req.params;
  const queueOptionData = req.body;

  const queueOption = await UpdateService(queueOptionId, queueOptionData);

  return res.status(200).json(queueOption);
};

export const remove = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { queueOptionId } = req.params;

  await DeleteService(queueOptionId);

  return res.status(200).json({ message: "Option Delected" });
};

export const mediaUpload = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { queueOptionId } = req.params;
  const files = req.files as Express.Multer.File[];
  const file = head(files);

  try {
    const queue = await QueueOption.findByPk(queueOptionId);

    queue.update({
      mediaPath: file.filename,
      mediaName: file.originalname
    });

    return res.send({ message: "File saved" });
  } catch (err: any) {
    throw new AppError(err.message);
  }
};

export const deleteMedia = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { queueOptionId } = req.params;

  try {
    const queue = await QueueOption.findByPk(queueOptionId);
    const filePath = path.resolve("public", queue.mediaPath);
    const fileExists = fs.existsSync(filePath);
    if (fileExists) {
      fs.unlinkSync(filePath);
    }

    queue.mediaPath = null;
    queue.mediaName = null;
    await queue.save();
    return res.send({ message: "File deleted" });
  } catch (err: any) {
    throw new AppError(err.message);
  }
};
