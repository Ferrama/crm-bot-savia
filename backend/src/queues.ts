import * as Sentry from "@sentry/node";
import Queue from "bull";
import { CronJob } from "cron";
import { subDays, subMinutes } from "date-fns";
import moment from "moment";
import { Op, QueryTypes, WhereOptions } from "sequelize";
import sequelize from "./database";
import { GetCompanySetting } from "./helpers/CheckSettings";
import GetDefaultWhatsApp from "./helpers/GetDefaultWhatsApp";
import GetWhatsappWbot from "./helpers/GetWhatsappWbot";
import formatBody, { mustacheFormat } from "./helpers/Mustache";
import { parseToMilliseconds } from "./helpers/parseToMilliseconds";
import { MessageData, SendMessage } from "./helpers/SendMessage";
import { getWbot } from "./libs/wbot";
import Company from "./models/Company";
import Contact from "./models/Contact";
import Invoices from "./models/Invoices";
import OutOfTicketMessage from "./models/OutOfTicketMessages";
import Plan from "./models/Plan";
import QueueModel from "./models/Queue";
import Schedule from "./models/Schedule";
import Setting from "./models/Setting";
import Ticket from "./models/Ticket";
import TicketTraking from "./models/TicketTraking";
import User from "./models/User";
import Whatsapp from "./models/Whatsapp";
import { startCampaignQueues } from "./queues/campaign";
import UpdateTicketService from "./services/TicketServices/UpdateTicketService";
import { handleMessage } from "./services/WbotServices/wbotMessageListener";
import { logger } from "./utils/logger";

const connection = process.env.REDIS_URI || "";
const limiterMax = process.env.REDIS_OPT_LIMITER_MAX || 1;
const limiterDuration = process.env.REDIS_OPT_LIMITER_DURATION || 3000;

export const userMonitor = new Queue("UserMonitor", connection);

export const messageQueue = new Queue("MessageQueue", connection, {
  limiter: {
    max: limiterMax as number,
    duration: limiterDuration as number
  }
});

export const scheduleMonitor = new Queue("ScheduleMonitor", connection);
export const sendScheduledMessages = new Queue(
  "SendSacheduledMessages",
  connection
);

async function handleSendMessage(job) {
  try {
    const { data } = job;

    const whatsapp = await Whatsapp.findByPk(data.whatsappId);

    if (whatsapp == null) {
      throw Error("Whatsapp não identificado");
    }

    const messageData: MessageData = data.data;

    await SendMessage(whatsapp, messageData);
  } catch (e: unknown) {
    Sentry.captureException(e);
    logger.error("MessageQueue -> SendMessage: error", (e as Error).message);
    throw e;
  }
}

async function handleVerifySchedules() {
  try {
    const { count, rows: schedules } = await Schedule.findAndCountAll({
      where: {
        status: "PENDING",
        sentAt: null,
        sendAt: {
          [Op.gte]: moment().format("YYYY-MM-DD HH:mm:ss"),
          [Op.lte]: moment().add("30", "seconds").format("YYYY-MM-DD HH:mm:ss")
        }
      },
      include: [{ model: Contact, as: "contact" }]
    });
    if (count > 0) {
      schedules.map(async schedule => {
        await schedule.update({
          status: "SCHEDULED"
        });
        sendScheduledMessages.add(
          "SendMessage",
          { schedule },
          { delay: 40000 }
        );
        logger.info(`Scheduled trigger for: ${schedule.contact.name}`);
      });
    }
  } catch (e: unknown) {
    Sentry.captureException(e);
    logger.error("SendScheduledMessage -> Verify: error", (e as Error).message);
    throw e;
  }
}

async function handleExpireOutOfTicketMessages() {
  OutOfTicketMessage.destroy({
    where: {
      createdAt: {
        [Op.lt]: subDays(new Date(), 1)
      }
    }
  });
}

async function handleSendScheduledMessage(job) {
  handleExpireOutOfTicketMessages();
  const {
    data: { schedule }
  } = job;
  let scheduleRecord: Schedule | null = null;

  try {
    scheduleRecord = await Schedule.findByPk(schedule.id, {
      include: [
        { model: Contact, as: "contact" },
        { model: User, as: "user" },
        { model: Whatsapp, as: "whatsapp" }
      ]
    });
  } catch (e) {
    Sentry.captureException(e);
    logger.error(`Error when trying to consult schedule: ${schedule.id}`);
  }

  try {
    let whatsapp;
    if (scheduleRecord?.whatsappId) {
      whatsapp = await Whatsapp.findByPk(scheduleRecord.whatsappId);
    } else {
      whatsapp = await GetDefaultWhatsApp(schedule.companyId);
    }

    if (!whatsapp) {
      throw new Error("Whatsapp não encontrado");
    }

    const message = await SendMessage(whatsapp, {
      number: schedule.contact.number,
      body: mustacheFormat({
        body: schedule.body,
        contact: schedule.contact,
        currentUser: schedule.user
      })
    });

    if (schedule.saveMessage) {
      handleMessage(
        message,
        await GetWhatsappWbot(whatsapp),
        schedule.companyId
      );
    }

    await scheduleRecord?.update({
      sentAt: new Date(),
      status: "SENT"
    });

    logger.info(`Scheduled message sent to: ${schedule.contact.name}`);
    sendScheduledMessages.clean(15000, "completed");
  } catch (e: unknown) {
    Sentry.captureException(e);
    await scheduleRecord?.update({
      status: "FAILED"
    });
    logger.error(
      "SendScheduledMessage -> SendMessage: error",
      (e as Error).message
    );
    throw e;
  }
}

export async function sleep(seconds: number) {
  logger.info(
    `Sleep of ${seconds} seconds started: ${moment().format("HH:mm:ss")}`
  );
  return new Promise(resolve => {
    setTimeout(() => {
      logger.info(
        `Sleep of ${seconds} seconds finished: ${moment().format("HH:mm:ss")}`
      );
      resolve(true);
    }, parseToMilliseconds(seconds));
  });
}

async function handleLoginStatus() {
  const users: { id: number }[] = await sequelize.query(
    'select id from "Users" where "updatedAt" < now() - \'5 minutes\'::interval and online = true',
    { type: QueryTypes.SELECT }
  );
  users.forEach(async item => {
    try {
      const user = await User.findByPk(item.id);
      await user.update({ online: false });
      logger.info(`User passed to offline: ${item.id}`);
    } catch (e: unknown) {
      Sentry.captureException(e);
    }
  });
}

async function setRatingExpired(tracking: TicketTraking, threshold: Date) {
  tracking.update({
    expired: true
  });

  if (tracking.ratingAt < subMinutes(threshold, 5)) {
    return;
  }

  const wbot = getWbot(tracking.whatsapp.id);

  const complationMessage =
    tracking.whatsapp.complationMessage.trim() || "Atendimento finalizado";

  await wbot.sendMessage(
    `${tracking.ticket.contact.number}@${
      tracking.ticket.isGroup ? "g.us" : "s.whatsapp.net"
    }`,
    {
      text: formatBody(`\u200e${complationMessage}`, tracking.ticket)
    }
  );

  logger.debug({ tracking }, "rating timedout");
}

async function handleRatingsTimeout() {
  const openTrackingRatings = await TicketTraking.findAll({
    where: {
      rated: false,
      expired: false,
      ratingAt: { [Op.not]: null }
    },
    include: [
      {
        model: Ticket,
        include: [
          {
            model: Contact
          },
          {
            model: User
          },
          {
            model: QueueModel,
            as: "queue"
          }
        ]
      },
      {
        model: Whatsapp
      }
    ]
  });

  const ratingThresholds = [];
  const currentTime = new Date();

  // eslint-disable-next-line no-restricted-syntax
  for await (const tracking of openTrackingRatings) {
    if (!ratingThresholds[tracking.companyId]) {
      const timeout =
        parseInt(
          await GetCompanySetting(tracking.companyId, "ratingsTimeout", "5"),
          10
        ) || 5;

      ratingThresholds[tracking.companyId] = subMinutes(currentTime, timeout);
    }
    if (tracking.ratingAt < ratingThresholds[tracking.companyId]) {
      setRatingExpired(tracking, ratingThresholds[tracking.companyId]);
    }
  }
}

async function handleNoQueueTimeout(
  company: Company,
  timeout: number,
  action: number
) {
  logger.trace(
    {
      timeout,
      action,
      companyId: company?.id
    },
    "handleNoQueueTimeout: entering"
  );

  if (action) {
    const queue = await QueueModel.findOne({
      where: {
        companyId: company.id,
        id: action
      }
    });

    if (!queue) {
      const removed = await Setting.destroy({
        where: {
          companyId: company.id,
          key: {
            [Op.like]: "noQueueTimeout%"
          }
        }
      });
      logger.info(
        { companyId: company.id, action, removed },
        "handleNoQueueTimeout -> removed incorrect setting"
      );
      return;
    }
  }

  const groupsTab =
    (await GetCompanySetting(company.id, "groupsTab", "disabled")) ===
    "enabled";

  const where: WhereOptions<Ticket> = {
    status: "pending",
    companyId: company.id,
    queueId: null,
    updatedAt: {
      [Op.lt]: subMinutes(new Date(), timeout)
    }
  };

  if (groupsTab) {
    where.isGroup = false;
  }

  const tickets = await Ticket.findAll({ where });

  logger.debug(
    { expiredCount: tickets.length },
    "handleNoQueueTimeout -> tickets"
  );

  const status = action ? "pending" : "closed";
  const queueId = action || null;

  tickets.forEach(ticket => {
    logger.trace(
      { ticket: ticket.id, userId: ticket.userId, status, queueId },
      "handleNoQueueTimeout -> UpdateTicketService"
    );
    const userId = status === "pending" ? null : ticket.userId;
    UpdateTicketService({
      ticketId: ticket.id,
      ticketData: { status, userId, queueId },
      companyId: company.id
    })
      .then(response => {
        logger.trace(
          { response },
          "handleNoQueueTimeout -> UpdateTicketService"
        );
      })
      .catch(error => {
        logger.error(
          { error, message: error?.message },
          "handleNoQueueTimeout -> UpdateTicketService"
        );
      });
  });

  logger.trace(
    {
      timeout,
      action,
      companyId: company?.id
    },
    "handleNoQueueTimeout: exiting"
  );
}

async function handleChatbotTicketTimeout(
  company: Company,
  timeout: number,
  action: number
) {
  logger.trace(
    {
      timeout,
      action,
      companyId: company?.id
    },
    "handleChatbotTicketTimeout: entering"
  );

  if (action) {
    const queue = await QueueModel.findOne({
      where: {
        companyId: company.id,
        id: action
      }
    });

    if (!queue) {
      const removed = await Setting.destroy({
        where: {
          companyId: company.id,
          key: {
            [Op.like]: "chatbotTicketTimeout%"
          }
        }
      });
      logger.info(
        { companyId: company.id, action, removed },
        "handleChatbotTicketTimeout -> removed incorrect setting"
      );
      return;
    }
  }

  const where: WhereOptions<Ticket> = {
    status: "pending",
    companyId: company.id,
    isGroup: false,
    chatbot: true,
    updatedAt: {
      [Op.lt]: subMinutes(new Date(), timeout)
    }
  };

  if (action) {
    where.queueId = {
      [Op.or]: [{ [Op.ne]: action }, { [Op.is]: null }]
    };
  }

  const tickets = await Ticket.findAll({ where });

  logger.debug(
    { expiredCount: tickets.length },
    "handleChatbotTicketTimeout -> tickets"
  );

  const ticketData: any = {
    status: action ? "pending" : "closed"
  };

  if (action) {
    ticketData.queueId = action;
  }

  tickets.forEach(ticket => {
    logger.trace(
      { ...ticketData },
      "handleChatbotTicketTimeout -> UpdateTicketService"
    );
    UpdateTicketService({
      ticketId: ticket.id,
      ticketData,
      companyId: company.id
    })
      .then(response => {
        logger.trace(
          { response },
          "handleChatbotTicketTimeout -> UpdateTicketService"
        );
      })
      .catch(error => {
        logger.error(
          { error, message: error?.message },
          "handleNoQueueTimeout -> UpdateTicketService"
        );
      });
  });

  logger.trace(
    {
      timeout,
      action,
      companyId: company?.id
    },
    "handleChatbotTicketTimeout: exiting"
  );
}

async function handleOpenTicketTimeout(
  company: Company,
  timeout: number,
  status: string
) {
  logger.trace(
    {
      timeout,
      status,
      companyId: company?.id
    },
    "handleOpenTicketTimeout"
  );
  const tickets = await Ticket.findAll({
    where: {
      status: "open",
      companyId: company.id,
      updatedAt: {
        [Op.lt]: subMinutes(new Date(), timeout)
      }
    }
  });

  tickets.forEach(ticket => {
    UpdateTicketService({
      ticketId: ticket.id,
      ticketData: {
        status,
        queueId: ticket.queueId,
        userId: status !== "pending" ? ticket.userId : null
      },
      companyId: company.id
    })
      .then(response => {
        logger.trace(
          { response },
          "handleOpenTicketTimeout -> UpdateTicketService"
        );
      })
      .catch(error => {
        logger.error(
          { error, message: error?.message },
          "handleOpenTicketTimeout -> UpdateTicketService"
        );
      });
  });
}

async function handleTicketTimeouts() {
  logger.trace("handleTicketTimeouts");
  const companies = await Company.findAll();

  companies.forEach(async company => {
    logger.trace({ companyId: company?.id }, "handleTicketTimeouts -> company");
    const noQueueTimeout = Number(
      await GetCompanySetting(company.id, "noQueueTimeout", "0")
    );
    if (noQueueTimeout) {
      const noQueueTimeoutAction = Number(
        await GetCompanySetting(company.id, "noQueueTimeoutAction", "0")
      );
      handleNoQueueTimeout(company, noQueueTimeout, noQueueTimeoutAction || 0)
        .then(() => {
          logger.trace(
            { companyId: company?.id },
            "handleTicketTimeouts -> returned from handleNoQueueTimeout"
          );
        })
        .catch(error => {
          logger.error(
            { error, message: error?.message },
            "handleTicketTimeouts -> error on handleNoQueueTimeout"
          );
        });
    }
    const openTicketTimeout = Number(
      await GetCompanySetting(company.id, "openTicketTimeout", "0")
    );
    if (openTicketTimeout) {
      const openTicketTimeoutAction = await GetCompanySetting(
        company.id,
        "openTicketTimeoutAction",
        "pending"
      );
      handleOpenTicketTimeout(
        company,
        openTicketTimeout,
        openTicketTimeoutAction
      );
    }
    const chatbotTicketTimeout = Number(
      await GetCompanySetting(company.id, "chatbotTicketTimeout", "0")
    );
    if (chatbotTicketTimeout) {
      const chatbotTicketTimeoutAction =
        Number(
          await GetCompanySetting(company.id, "chatbotTicketTimeoutAction", "0")
        ) || 0;
      handleChatbotTicketTimeout(
        company,
        chatbotTicketTimeout,
        chatbotTicketTimeoutAction
      );
    }
  });
}

async function handleEveryMinute() {
  handleLoginStatus();
  handleRatingsTimeout();
  handleTicketTimeouts();
}

const createInvoices = new CronJob("0 * * * * *", async () => {
  const companies = await Company.findAll();
  companies.map(async c => {
    const dueDate = new Date(c.dueDate);
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 20) {
      const plan = await Plan.findByPk(c.planId);

      const invoiceCount = await Invoices.count({
        where: {
          companyId: c.id,
          dueDate: {
            [Op.like]: `${dueDate.toISOString().split("T")[0]}%`
          }
        }
      });

      if (invoiceCount === 0) {
        await Invoices.destroy({
          where: {
            companyId: c.id,
            status: "open"
          }
        });
        await Invoices.create({
          detail: plan.name,
          status: "open",
          value: plan.value,
          dueDate: dueDate.toISOString().split("T")[0],
          companyId: c.id
        });
      }
    }
  });
});

createInvoices.start();

export async function startQueueProcess() {
  logger.info("Starting queue processing");

  startCampaignQueues().then(() => {
    logger.info("Campaign processing functions started");
  });

  messageQueue.process("SendMessage", handleSendMessage);

  scheduleMonitor.process("Verify", handleVerifySchedules);

  sendScheduledMessages.process("SendMessage", handleSendScheduledMessage);

  userMonitor.process("EveryMinute", handleEveryMinute);

  scheduleMonitor.add(
    "Verify",
    {},
    {
      repeat: { cron: "*/5 * * * * *" },
      removeOnComplete: true
    }
  );

  userMonitor.add(
    "EveryMinute",
    {},
    {
      repeat: { cron: "* * * * *" },
      removeOnComplete: true
    }
  );
}
