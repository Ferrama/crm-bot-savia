import AppError from "../../errors/AppError";
import Campaign from "../../models/Campaign";

const DeleteService = async (id: string): Promise<void> => {
  const record = await Campaign.findOne({
    where: { id }
  });

  if (!record) {
    throw new AppError("ERR_NO_CAMPAIGN_FOUND", 404);
  }

  if (record.status === "IN_PROGRESS") {
    throw new AppError("Cannot delete campaign in progress", 400);
  }

  await record.destroy();
};

export default DeleteService;
