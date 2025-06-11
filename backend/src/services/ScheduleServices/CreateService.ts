import * as Yup from "yup";

import AppError from "../../errors/AppError";
import Contact from "../../models/Contact";
import Schedule from "../../models/Schedule";
import Whatsapp from "../../models/Whatsapp";

interface Request {
  body: string;
  sendAt: Date;
  contactId: number;
  companyId: number;
  userId?: number;
  saveMessage?: boolean;
  whatsappId?: number;
}

const CreateService = async ({
  body,
  sendAt,
  contactId,
  companyId,
  userId,
  saveMessage,
  whatsappId
}: Request): Promise<Schedule> => {
  const schema = Yup.object().shape({
    body: Yup.string().required().min(5),
    sendAt: Yup.string().required()
  });

  try {
    await schema.validate({ body, sendAt });
  } catch (err) {
    throw new AppError(err.message);
  }

  if (whatsappId) {
    const whatsapp = await Whatsapp.findOne({
      where: { id: whatsappId, companyId }
    });

    if (!whatsapp) {
      throw new AppError("ERR_WHATSAPP_NOT_FOUND", 404);
    }
  }

  const schedule = await Schedule.create({
    body,
    sendAt,
    contactId,
    companyId,
    userId,
    saveMessage,
    whatsappId,
    status: "PENDING"
  });

  await schedule.reload({
    include: [
      { model: Contact, as: "contact" },
      { model: Whatsapp, as: "whatsapp" }
    ]
  });

  return schedule;
};

export default CreateService;
