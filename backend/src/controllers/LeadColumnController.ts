import { Request, Response } from "express";
import * as Yup from "yup";
import AppError from "../errors/AppError";
import { getIO } from "../libs/socket";
import Lead from "../models/Lead";
import LeadColumn from "../models/LeadColumn";

interface LeadColumnData {
  name: string;
  color: string;
  order: number;
}

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
          { model: Lead.associations.contact.target, as: "contact" },
          {
            model: Lead.associations.assignedTo.target,
            as: "assignedTo",
            attributes: ["id", "name"]
          }
        ]
      }
    ]
  });

  return res.json(columns);
};

export const store = async (req: Request, res: Response): Promise<Response> => {
  const { companyId } = req.user;
  const data = req.body as LeadColumnData;

  const schema = Yup.object().shape({
    name: Yup.string().required(),
    color: Yup.string().required(),
    order: Yup.number().required()
  });

  try {
    await schema.validate(data);
  } catch (err) {
    throw new AppError(err.message);
  }

  const column = await LeadColumn.create({
    ...data,
    companyId
  });

  const io = getIO();
  io.emit(`leadColumn:${companyId}`, {
    action: "create",
    column
  });

  return res.status(200).json(column);
};

export const update = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;
  const { companyId } = req.user;
  const data = req.body as LeadColumnData;

  const schema = Yup.object().shape({
    name: Yup.string(),
    color: Yup.string(),
    order: Yup.number()
  });

  try {
    await schema.validate(data);
  } catch (err) {
    throw new AppError(err.message);
  }

  const column = await LeadColumn.findByPk(id);

  if (!column || column.companyId !== companyId) {
    throw new AppError("Lead column not found");
  }

  await column.update(data);

  const io = getIO();
  io.emit(`leadColumn:${companyId}`, {
    action: "update",
    column
  });

  return res.status(200).json(column);
};

export const remove = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;
  const { companyId } = req.user;

  const column = await LeadColumn.findByPk(id);

  if (!column || column.companyId !== companyId) {
    throw new AppError("Lead column not found");
  }

  // Check if there are any leads in this column
  const leadCount = await Lead.count({ where: { columnId: id } });
  if (leadCount > 0) {
    throw new AppError(
      "Cannot delete column with leads. Move or delete the leads first."
    );
  }

  await column.destroy();

  const io = getIO();
  io.emit(`leadColumn:${companyId}`, {
    action: "delete",
    columnId: id
  });

  return res.status(200).json({ message: "Lead column deleted" });
};

export const reorder = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { companyId } = req.user;
  const { columns } = req.body as { columns: { id: number; order: number }[] };

  const schema = Yup.object().shape({
    columns: Yup.array()
      .of(
        Yup.object().shape({
          id: Yup.number().required(),
          order: Yup.number().required()
        })
      )
      .required()
  });

  try {
    await schema.validate({ columns });
  } catch (err) {
    throw new AppError(err.message);
  }

  // Update all columns in a transaction
  await LeadColumn.sequelize.transaction(async t => {
    for (const { id, order } of columns) {
      const column = await LeadColumn.findOne({
        where: { id, companyId },
        transaction: t
      });

      if (!column) {
        throw new AppError(`Lead column ${id} not found`);
      }

      await column.update({ order }, { transaction: t });
    }
  });

  const updatedColumns = await LeadColumn.findAll({
    where: { companyId },
    order: [["order", "ASC"]]
  });

  const io = getIO();
  io.emit(`leadColumn:${companyId}`, {
    action: "reorder",
    columns: updatedColumns
  });

  return res.status(200).json(updatedColumns);
};
