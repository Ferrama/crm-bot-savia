import axios from "axios";
import { Request, Response } from "express";
import AppError from "../../errors/AppError";
import { getIO } from "../../libs/socket";
import Company from "../../models/Company";
import Invoices from "../../models/Invoices";
import { logger } from "../../utils/logger";
import GetSuperSettingService from "../SettingServices/GetSuperSettingService";
import {
  processInvoiceExpired,
  processInvoicePaid
} from "./PaymentGatewayServices";

const owenBaseURL = "https://api.apipix.me/v1";

interface OwenConfig {
  user: string;
  password: string;
  secretkey: string;
}

const owenLoadConfig = async (): Promise<OwenConfig> => {
  return {
    user: await GetSuperSettingService({ key: "_owenCnpj" }),
    password: await GetSuperSettingService({ key: "_owenToken" }),
    secretkey: await GetSuperSettingService({ key: "_owenSecretKey" })
  };
};

export const owenWebhook = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { data } = req.body;
  if (data.status === "APPROVED") {
    const { qrcodeId } = data;
    const invoice = await Invoices.findOne({
      where: {
        txId: qrcodeId,
        status: "open"
      },
      include: { model: Company, as: "company" }
    });

    if (!invoice || data.valor < invoice.value) {
      return res.json({ ok: true });
    }

    const expiresAt = new Date(invoice.company.dueDate);
    expiresAt.setDate(expiresAt.getDate() + 30);
    const date = expiresAt.toISOString().split("T")[0];

    await invoice.company.update({
      dueDate: date
    });
    await invoice.update({
      status: "paid"
    });
    await invoice.company.reload();
    const io = getIO();

    io.to(`company-${invoice.companyId}-mainchannel`)
      .to("super")
      .emit(`company-${invoice.companyId}-payment`, {
        action: "CONCLUIDA",
        company: invoice.company,
        invoiceId: invoice.id
      });
  }
  return res.json({ ok: true });
};

export const owenCheckStatus = async (
  invoice: Invoices,
  owenConfig: OwenConfig = null
): Promise<boolean> => {
  try {
    if (!owenConfig) {
      owenConfig = await owenLoadConfig();
    }

    const txDetail = await axios.get(`${owenBaseURL}/qrstatus`, {
      params: {
        qrcodeId: invoice.txId,
        ...owenConfig
      }
    });

    if (txDetail?.data?.data?.status !== "APPROVED") {
      return false;
    }

    if (txDetail?.data?.data?.sender?.valor >= invoice.value) {
      await processInvoicePaid(invoice);
      return true;
    }

    return false;
  } catch (error) {
    logger.error(error, "Error getting detail of txid");
  }

  return false;
};

const owenPollCheckStatus = async (
  owenConfig: OwenConfig,
  invoice: Invoices,
  retries = 10,
  interval = 30000
) => {
  let attempts = 0;

  async function pollStatus(): Promise<void> {
    await invoice.reload();

    if (invoice.status === "paid") {
      logger.debug(
        `owenPollCheckStatus: Invoice ${invoice.id} already paid, finishing polling`
      );
      return;
    }

    const successful = await owenCheckStatus(invoice, owenConfig);
    if (successful) {
      return;
    }

    attempts += 1;

    if (attempts >= retries) {
      processInvoiceExpired(invoice);
      return;
    }

    await new Promise(resolve => {
      setTimeout(resolve, interval);
    });
    await pollStatus();
  }

  return pollStatus();
};

export const owenCreateSubscription = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { price, invoiceId } = req.body;

  const owenConfig: OwenConfig = await owenLoadConfig();

  const qrData = {
    params: {
      valor: price.toFixed([2]),
      minutos: 5,
      mensagem: `#Fatura:${invoiceId}`,
      ...owenConfig
    }
  };

  try {
    const invoice = await Invoices.findByPk(invoiceId);
    if (!invoice) {
      throw new Error("Invoice not found");
    }
    const qrResult = await axios.get(`${owenBaseURL}/qrdinamico`, qrData);
    invoice.update({
      value: price,
      txId: qrResult.data.data.qrcodeId,
      payGw: "owen",
      payGwData: JSON.stringify(qrResult.data.data)
    });

    owenPollCheckStatus(owenConfig, invoice);

    return res.json({
      qrcode: { qrcode: qrResult.data.data.qrcode },
      valor: { original: price }
    });
  } catch (error) {
    logger.error({ error }, "owenCreateSubscription error");
    throw new AppError(
      "Problema encontrado, entre em contato com o suporte!",
      400
    );
  }
};
