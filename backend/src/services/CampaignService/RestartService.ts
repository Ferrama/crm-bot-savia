import Campaign from "../../models/Campaign";
import { campaignQueue } from "../../queues/campaign";

export async function RestartService(id: number) {
  const campaign = await Campaign.findByPk(id);
  await campaign.update({ status: "IN_PROGRESS" });

  await campaignQueue.add("ProcessCampaign", {
    id: campaign.id,
    delay: 3000
  });
}
