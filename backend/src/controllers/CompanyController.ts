import axios from "axios";
import { Request, Response } from "express";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import * as Yup from "yup";
import AppError from "../errors/AppError";
import { getIO } from "../libs/socket";
import Company from "../models/Company";
import LeadColumn from "../models/LeadColumn";

import User from "../models/User";
import DeleteCompanyService from "../services/CompanyService/DeleteCompanyService";
import FindAllCompaniesService from "../services/CompanyService/FindAllCompaniesService";
import ListCompaniesService from "../services/CompanyService/ListCompaniesService";
import ShowCompanyService from "../services/CompanyService/ShowCompanyService";
import UpdateCompanyService from "../services/CompanyService/UpdateCompanyService";
import UpdateSchedulesService from "../services/CompanyService/UpdateSchedulesService";
import CreateUserFromSaviaService from "../services/UserServices/CreateUserFromSaviaService";

import CheckSettings from "../helpers/CheckSettings";

type IndexQuery = {
  searchParam: string;
  pageNumber: string;
};

type CompanyData = {
  name: string;
  id?: number;
  phone?: string;
  email?: string;
  status?: boolean;
  planId?: number;
  dueDate?: string;
  saviaDbUrl: string;
  includeUsers: boolean;
};

type SchedulesData = {
  schedules: [];
};

export const index = async (req: Request, res: Response): Promise<Response> => {
  const { searchParam, pageNumber } = req.query as IndexQuery;

  const { companies, count, hasMore } = await ListCompaniesService({
    searchParam,
    pageNumber
  });

  return res.json({ companies, count, hasMore });
};

export const store = async (req: Request, res: Response): Promise<Response> => {
  const {
    name,
    email,
    phone,
    status,
    planId,
    dueDate,
    saviaDbUrl,
    includeUsers
  } = req.body as CompanyData;

  const schema = Yup.object().shape({
    name: Yup.string().required(),
    email: Yup.string().email().required(),
    phone: Yup.string().required(),
    status: Yup.boolean().required(),
    planId: Yup.number().required(),
    dueDate: Yup.date().required(),
    saviaDbUrl: Yup.string()
      .required()
      .matches(
        /^mysql:\/\/.+:.+@.+:\d+\/.+$/,
        "Savia DB URL must be in format: mysql://user:password@host:port/database"
      )
  });

  try {
    await schema.validate(req.body);
  } catch (err) {
    throw new AppError(err.message);
  }

  const company = await Company.create({
    name,
    email,
    phone,
    status,
    planId,
    dueDate,
    saviaDbUrl,
    apiKey: uuidv4()
  });

  // Create default lead columns
  const defaultColumns = [
    { name: "New", color: "#4CAF50", order: 1 },
    { name: "Contacted", color: "#2196F3", order: 2 },
    { name: "Qualified", color: "#FFC107", order: 3 },
    { name: "Proposal", color: "#9C27B0", order: 4 },
    { name: "Negotiation", color: "#FF9800", order: 5 },
    { name: "Closed Won", color: "#4CAF50", order: 6 },
    { name: "Closed Lost", color: "#F44336", order: 7 }
  ];

  await LeadColumn.bulkCreate(
    defaultColumns.map(column => ({
      ...column,
      companyId: company.id
    }))
  );

  const io = getIO();
  io.emit("company:create", {
    action: "create",
    company
  });

  // Handle includeUsers action
  if (includeUsers) {
    try {
      const result = await CreateUserFromSaviaService({
        companyId: company.id
      });
      console.log(
        `User import completed for company ${company.id}: ${result.created} created, ${result.skipped} skipped, ${result.errors.length} errors`
      );
      if (result.errors.length > 0) {
        console.error("User import errors:", result.errors);
      }
    } catch (error) {
      console.error(`Error importing users from Savia DB: ${error.message}`);
      // Don't fail the company creation if user fetching fails
    }
  }

  return res.status(200).json(company);
};

export const signup = async (
  req: Request,
  res: Response
): Promise<Response> => {
  if ((await CheckSettings("allowSignup")) !== "enabled") {
    return res.status(401).json("🙎🏻‍♂️ Signup disabled");
  }

  if (process.env.RECAPTCHA_SECRET_KEY) {
    if (!req.body.captchaToken) {
      return res.status(401).json("empty captcha");
    }
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${req.body.captchaToken}`
    );

    if (!response.data.success) {
      return res.status(401).json("🤖 be gone");
    }
  }

  req.body.dueDate = moment().add(3, "day").format();

  return store(req, res);
};

export const show = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;

  const requestUser = await User.findByPk(req.user.id);

  if (!requestUser.super && Number.parseInt(id, 10) !== requestUser.companyId) {
    throw new AppError("ERR_FORBIDDEN", 403);
  }

  const company = await ShowCompanyService(id);

  return res.status(200).json(company);
};

export const list = async (req: Request, res: Response): Promise<Response> => {
  const companies: Company[] = await FindAllCompaniesService();

  return res.status(200).json(companies);
};

export const update = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const companyData: CompanyData = req.body;

  const schema = Yup.object().shape({
    name: Yup.string().required(),
    email: Yup.string().email().required(),
    phone: Yup.string().required(),
    status: Yup.boolean().required(),
    planId: Yup.number().required(),
    dueDate: Yup.date().required(),
    saviaDbUrl: Yup.string()
      .required()
      .matches(
        /^mysql:\/\/.+:.+@.+:\d+\/.+$/,
        "Savia DB URL must be in format: mysql://user:password@host:port/database"
      )
  });

  try {
    await schema.validate(companyData);
  } catch (err) {
    throw new AppError(err.message);
  }

  const { id } = req.params;

  const company = await UpdateCompanyService({ id, ...companyData });

  return res.status(200).json(company);
};

export const updateSchedules = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { schedules }: SchedulesData = req.body;
  const { id } = req.params;
  const requestUser = await User.findByPk(req.user.id);

  if (!requestUser.super && Number.parseInt(id, 10) !== requestUser.companyId) {
    throw new AppError("ERR_FORBIDDEN", 403);
  }

  const company = await UpdateSchedulesService({
    id,
    schedules
  });

  return res.status(200).json(company);
};

export const remove = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;

  if (Number(id) === 1) {
    throw new AppError("ERR_FORBIDDEN", 403);
  }

  const company = await DeleteCompanyService(id);

  return res.status(200).json(company);
};
