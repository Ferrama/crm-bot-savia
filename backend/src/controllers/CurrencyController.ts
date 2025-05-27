import { Request, Response } from "express";
import { Op } from "sequelize";
import Currency from "../models/Currency";

export const index = async (req: Request, res: Response): Promise<Response> => {
  const { searchParam } = req.query as { searchParam?: string };

  try {
    const whereCondition = searchParam
      ? {
          [Op.or]: [
            { code: { [Op.like]: `%${searchParam}%` } },
            { name: { [Op.like]: `%${searchParam}%` } }
          ]
        }
      : {};

    const currencies = await Currency.findAll({
      where: whereCondition,
      order: [["code", "ASC"]]
    });

    return res.json(currencies);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const store = async (req: Request, res: Response): Promise<Response> => {
  const { code, symbol, name } = req.body;

  try {
    const currency = await Currency.create({
      code,
      symbol,
      name
    });

    return res.status(201).json(currency);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const update = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;
  const { code, symbol, name, isActive } = req.body;

  try {
    const currency = await Currency.findByPk(id);

    if (!currency) {
      return res.status(404).json({ error: "Currency not found" });
    }

    await currency.update({
      code,
      symbol,
      name,
      isActive
    });

    return res.json(currency);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const remove = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;

  try {
    const currency = await Currency.findByPk(id);

    if (!currency) {
      return res.status(404).json({ error: "Currency not found" });
    }

    await currency.destroy();

    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
