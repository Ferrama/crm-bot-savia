import { AnyMessageContent, proto } from "baileys";
import fs from "fs";
import iconv from "iconv-lite";
import mime from "mime-types";
import Message from "../models/Message";
import OutOfTicketMessage from "../models/OutOfTicketMessages";
import Whatsapp from "../models/Whatsapp";
import { getMessageFileOptions } from "../services/WbotServices/SendWhatsAppMedia";
import { handleMessage } from "../services/WbotServices/wbotMessageListener";
import CheckSettings from "./CheckSettings";
import GetWhatsappWbot from "./GetWhatsappWbot";
import saveMediaToFile from "./saveMediaFile";

export type MessageData = {
  number: string;
  body: string;
  mediaPath?: string;
  internal?: boolean;
  ptt?: boolean;
  quickMessageMediaId?: number;
  saveOnTicket?: boolean | number;
  fromMe?: boolean;
  read?: boolean;
  quotedMsg?: Message;
  linkPreview?: any;
};

export const SendMessage = async (
  whatsapp: Whatsapp,
  messageData: MessageData
): Promise<any> => {
  try {
    const wbot = await GetWhatsappWbot(whatsapp);
    const number = messageData.number.toString();
    const chatId = number.includes("@") ? number : `${number}@s.whatsapp.net`;

    let message: proto.WebMessageInfo;

    const body = `${messageData.body}`;

    if (messageData.mediaPath) {
      // get filesize
      const filesize = fs.statSync(messageData.mediaPath).size;
      const fileLimit = parseInt(await CheckSettings("uploadLimit", "15"), 10);

      let options: AnyMessageContent;

      if (filesize > fileLimit * 1024 * 1024) {
        const filename = messageData.mediaPath.split("/").pop();
        let originalFilename = "";
        try {
          originalFilename = iconv.decode(
            Buffer.from(filename, "binary"),
            "utf8"
          );
        } catch (error) {
          console.error("Error converting filename to UTF-8:", error);
        }
        let fileUrl = encodeURI(
          await saveMediaToFile(
            {
              data: fs.readFileSync(messageData.mediaPath),
              mimetype:
                mime.lookup(originalFilename) || "application/octet-stream",
              filename: messageData.mediaPath.split("/").pop() || "file.bin"
            },
            undefined,
            undefined,
            whatsapp.companyId
          )
        );
        if (!fileUrl.startsWith("http")) {
          fileUrl = `${process.env.BACKEND_URL}/public/${fileUrl}`;
        }
        options = {
          text: `${body}\n\n📎 *${originalFilename}*\n\n🔗 ${fileUrl}`
        };
      } else {
        options = await getMessageFileOptions(body, messageData.mediaPath);
      }
      if (options) {
        message = await wbot.sendMessage(chatId, {
          ...options
        });
      }
    } else {
      // Check if message contains URL
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      urlRegex.test(body); // Just for logging purposes if needed

      message = await wbot.sendMessage(chatId, {
        text: body,
        quoted: messageData.quotedMsg
          ? {
              key: {
                remoteJid: chatId,
                id: messageData.quotedMsg.id
              }
            }
          : undefined
      } as AnyMessageContent);
    }

    if (messageData.saveOnTicket) {
      handleMessage(
        message,
        await GetWhatsappWbot(whatsapp),
        whatsapp.companyId,
        Number(messageData.saveOnTicket) || null
      );
    } else {
      wbot.cacheMessage(message);
      await OutOfTicketMessage.create({
        id: message.key.id,
        dataJson: JSON.stringify(message),
        whatsappId: whatsapp.id
      });
    }

    return message;
  } catch (err: any) {
    throw new Error(err);
  }
};
