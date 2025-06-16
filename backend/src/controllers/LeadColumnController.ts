import { Request, Response } from "express";
import { Op } from "sequelize";
import * as Yup from "yup";
import {
  getDefaultColumnByCode,
  getDefaultColumns
} from "../config/defaultLeadColumns";
import AppError from "../errors/AppError";
import { getIO } from "../libs/socket";
import Contact from "../models/Contact";
import Currency from "../models/Currency";
import Lead from "../models/Lead";
import LeadColumn from "../models/LeadColumn";
import Tag from "../models/Tag";
import User from "../models/User";

export const index = async (req: Request, res: Response): Promise<Response> => {
  const { companyId } = req.user;

  const columns = await LeadColumn.findAll({
    where: { companyId },
    order: [["order", "ASC"]],
    include: [
      {
        model: Lead,
        as: "leads",
        include: [
          {
            model: Contact,
            as: "contact",
            attributes: ["id", "name", "number"]
          },
          { model: User, as: "assignedTo", attributes: ["id", "name"] },
          {
            model: Tag,
            as: "tagRelations",
            attributes: ["id", "name", "color"]
          },
          {
            model: Currency,
            as: "currency",
            attributes: ["id", "code", "symbol", "name"]
          }
        ],
        order: [["createdAt", "DESC"]]
      }
    ]
  });

  return res.json(columns);
};

export const store = async (req: Request, res: Response): Promise<Response> => {
  const { name, color, order, code } = req.body;
  const { companyId } = req.user;

  const schema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    color: Yup.string().required("Color is required"),
    order: Yup.number().required("Order is required"),
    code: Yup.string().nullable()
  });

  try {
    await schema.validate(req.body);
  } catch (err) {
    throw new AppError(err.message);
  }

  // Si se proporciona un código, verificar que sea válido
  if (code) {
    const defaultColumn = getDefaultColumnByCode(code);
    if (!defaultColumn) {
      throw new AppError("Invalid column code");
    }
  }

  // Verificar que el nombre no esté duplicado en la compañía
  const existingColumn = await LeadColumn.findOne({
    where: { name, companyId }
  });

  if (existingColumn) {
    throw new AppError("A column with this name already exists");
  }

  const column = await LeadColumn.create({
    name,
    color,
    order,
    code,
    isSystem: false,
    companyId
  });

  const io = getIO();
  io.emit(`leadColumn:${companyId}`, {
    action: "create",
    column
  });

  return res.status(201).json(column);
};

export const update = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;
  const { name, color, order } = req.body;
  const { companyId } = req.user;

  const schema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    color: Yup.string().required("Color is required"),
    order: Yup.number().required("Order is required")
  });

  try {
    await schema.validate(req.body);
  } catch (err) {
    throw new AppError(err.message);
  }

  const column = await LeadColumn.findOne({
    where: { id, companyId }
  });

  if (!column) {
    throw new AppError("Column not found");
  }

  // No permitir editar columnas del sistema
  if (column.isSystem) {
    throw new AppError("System columns cannot be modified");
  }

  // Verificar que el nombre no esté duplicado en la compañía
  const existingColumn = await LeadColumn.findOne({
    where: { name, companyId, id: { [Op.ne]: id } }
  });

  if (existingColumn) {
    throw new AppError("A column with this name already exists");
  }

  await column.update({ name, color, order });

  const io = getIO();
  io.emit(`leadColumn:${companyId}`, {
    action: "update",
    column
  });

  return res.json(column);
};

export const remove = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;
  const { companyId } = req.user;

  const column = await LeadColumn.findOne({
    where: { id, companyId }
  });

  if (!column) {
    throw new AppError("Column not found");
  }

  // No permitir eliminar columnas del sistema
  if (column.isSystem) {
    throw new AppError("System columns cannot be deleted");
  }

  await column.destroy();

  const io = getIO();
  io.emit(`leadColumn:${companyId}`, {
    action: "delete",
    columnId: id
  });

  return res.status(200).json({ message: "Column deleted" });
};

export const updateOrder = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { columns } = req.body;
  const { companyId } = req.user;

  const schema = Yup.object().shape({
    columns: Yup.array().of(
      Yup.object().shape({
        id: Yup.number().required(),
        order: Yup.number().required()
      })
    )
  });

  try {
    await schema.validate(req.body);
  } catch (err) {
    throw new AppError(err.message);
  }

  // Actualizar el orden de todas las columnas en una sola transacción
  const updatePromises = columns.map((column: { id: number; order: number }) =>
    LeadColumn.update(
      { order: column.order },
      { where: { id: column.id, companyId } }
    )
  );

  await Promise.all(updatePromises);

  const updatedColumns = await LeadColumn.findAll({
    where: { companyId },
    order: [["order", "ASC"]]
  });

  const io = getIO();
  io.emit(`leadColumn:${companyId}`, {
    action: "updateOrder",
    columns: updatedColumns
  });

  return res.status(200).json(updatedColumns);
};

export const getDefaultColumnsConfig = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const defaultColumns = getDefaultColumns();
  return res.json(defaultColumns);
};

export const createFromDefault = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { code } = req.body;
  const { companyId } = req.user;

  const schema = Yup.object().shape({
    code: Yup.string().required("Code is required")
  });

  try {
    await schema.validate(req.body);
  } catch (err) {
    throw new AppError(err.message);
  }

  const defaultColumn = getDefaultColumnByCode(code);
  if (!defaultColumn) {
    throw new AppError("Invalid column code");
  }

  // Verificar si ya existe una columna con este código en la compañía
  const existingColumn = await LeadColumn.findOne({
    where: { code, companyId }
  });

  if (existingColumn) {
    throw new AppError("A column with this code already exists");
  }

  // Obtener el siguiente orden disponible
  const maxOrder = (await LeadColumn.max("order", {
    where: { companyId }
  })) as number;
  const nextOrder = (maxOrder || 0) + 1;

  const column = await LeadColumn.create({
    name: defaultColumn.name,
    color: defaultColumn.color,
    order: nextOrder,
    code: defaultColumn.code,
    isSystem: true,
    companyId
  });

  const io = getIO();
  io.emit(`leadColumn:${companyId}`, {
    action: "create",
    column
  });

  return res.status(201).json(column);
};
