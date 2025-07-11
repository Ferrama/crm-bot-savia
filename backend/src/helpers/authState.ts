import type {
  AuthenticationCreds,
  AuthenticationState,
  SignalDataTypeMap
} from "baileys";
import { BufferJSON, initAuthCreds, proto } from "baileys";
import BaileysKeys from "../models/BaileysKeys";
import Whatsapp from "../models/Whatsapp";
import { logger } from "../utils/logger";

const authState = async (
  whatsapp: Whatsapp
): Promise<{ state: AuthenticationState; saveState: () => void }> => {
  let creds: AuthenticationCreds;
  const whatsappId = whatsapp.id;

  const saveKey = async (type: string, key: string, value: any) => {
    logger.debug(
      `Storing key whatsappId: ${whatsappId} type: ${type} key: ${key}`
    );
    return BaileysKeys.upsert({
      whatsappId,
      type,
      key,
      value: JSON.stringify(value)
    });
  };

  const getKey = async (type: string, key: string) => {
    const baileysKey = await BaileysKeys.findOne({
      where: {
        whatsappId,
        type,
        key
      }
    });

    if (!baileysKey) {
      logger.debug(
        `Key not found whatsappId: ${whatsappId} type: ${type} key: ${key}`
      );
    }

    return baileysKey?.value ? JSON.parse(baileysKey.value) : null;
  };

  const removeKey = async (type: string, key: string) => {
    logger.debug(
      `Deleting key whatsappId: ${whatsappId} type: ${type} key: ${key}`
    );
    return BaileysKeys.destroy({
      where: {
        whatsappId,
        type,
        key
      }
    });
  };

  const saveState = async () => {
    try {
      await whatsapp.update({
        session: JSON.stringify({ creds, keys: {} }, BufferJSON.replacer, 0)
      });
    } catch (error) {
      console.log(error);
    }
  };

  if (whatsapp.session && whatsapp.session !== null) {
    const result = JSON.parse(whatsapp.session, BufferJSON.reviver);
    creds = result.creds;
    const { keys } = result;

    if (Object.keys(keys).length) {
      logger.info("Clearing old format session keys data");
      saveState();
    }
  } else {
    creds = initAuthCreds();
  }

  return {
    state: {
      creds,
      keys: {
        get: async (type, ids) => {
          const data: { [id: string]: SignalDataTypeMap[typeof type] } = {};

          let counter = 0;
          // eslint-disable-next-line no-restricted-syntax
          for await (const id of ids) {
            try {
              let value = await getKey(type, id);
              if (value && type === "app-state-sync-key") {
                value = proto.Message.AppStateSyncKeyData.fromObject(value);
              }
              data[id] = value;
              if (value) {
                counter += 1;
              }
            } catch (error) {
              logger.error(`authState (69) -> error: ${error.message}`);
              logger.error(`authState (72) -> stack: ${error.stack}`);
            }
          }

          logger.debug(
            `Keys retrieved: whatsappId: ${whatsappId} type: ${type} Counter: ${counter}/${ids.length}`
          );
          return data;
        },
        set: async (data: any) => {
          const tasks: Promise<unknown>[] = [];
          // eslint-disable-next-line no-restricted-syntax, guard-for-in
          for (const category in data) {
            if (category === "pre-key") {
              logger.info({ category: data[category] }, "Setting pre-keys");
            }
            // eslint-disable-next-line no-restricted-syntax, guard-for-in
            for (const id in data[category]) {
              const value = data[category][id];
              tasks.push(
                value ? saveKey(category, id, value) : removeKey(category, id)
              );
            }
          }

          await Promise.all(tasks);
        }
      }
    },
    saveState
  };
};

export default authState;
