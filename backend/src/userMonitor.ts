import * as Sentry from "@sentry/node";
import Queue from "bull";
import { isNil } from "lodash";
import { QueryTypes } from "sequelize";

import sequelize from "./database";
import User from "./models/User";
import { logger } from "./utils/logger";

const connection = process.env.REDIS_URI || "";

export const userMonitor = new Queue("UserMonitor", connection);

async function handleLoginStatus(job) {
  const users: { id: number }[] = await sequelize.query(
    'select id from "Users" where "updatedAt" < now() - \'5 minutes\'::interval and online = true',
    { type: QueryTypes.SELECT }
  );
  for (const item of users) {
    try {
      const user = await User.findByPk(item.id);
      await user.update({ online: false });
      logger.info(`Usuário passado para offline: ${item.id}`);
    } catch (e: any) {
      Sentry.captureException(e);
    }
  }
}

async function handleUserConnection(job) {
  try {
    const { id } = job.data;

    if (!isNil(id) && id !== "null") {
      const user = await User.findByPk(id);
      if (user) {
        user.online = true;
        await user.save();
      }
    }
  } catch (e) {
    Sentry.captureException(e);
  }
}

userMonitor.process("UserConnection", handleUserConnection);
userMonitor.process("VerifyLoginStatus", handleLoginStatus);

export async function initUserMonitorQueues() {
  const repeatableJobs = await userMonitor.getRepeatableJobs();
  for (const job of repeatableJobs) {
    await userMonitor.removeRepeatableByKey(job.key);
  }

  userMonitor.add(
    "VerifyLoginStatus",
    {},
    {
      repeat: { cron: "* * * * *" },
      removeOnComplete: { age: 60 * 60, count: 10 },
      removeOnFail: { age: 60 * 60, count: 10 }
    }
  );
  logger.info("Queue: monitoramento de status de usuário inicializado");
}
