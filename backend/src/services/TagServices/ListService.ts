import { Op, col, fn } from "sequelize";
import Tag from "../../models/Tag";
import Ticket from "../../models/Ticket";

interface Request {
  companyId: number;
  searchParam?: string;
  pageNumber?: string | number;
  kanban?: number;
}

interface Response {
  tags: Tag[];
  count: number;
  hasMore: boolean;
}

const ListService = async ({
  companyId,
  searchParam,
  pageNumber = "1",
  kanban = 0
}: Request): Promise<Response> => {
  let whereCondition = {};
  const limit = 20;
  const offset = limit * (+pageNumber - 1);

  if (searchParam) {
    whereCondition = {
      [Op.or]: [
        { name: { [Op.like]: `%${searchParam}%` } },
        { color: { [Op.like]: `%${searchParam}%` } }
      ]
    };
  }

  const { count: counters, rows: tags } = await Tag.findAndCountAll({
    where: { ...whereCondition, companyId, kanban },
    limit,
    offset,
    order: [["name", "ASC"]],
    subQuery: false,
    include: [
      {
        model: Ticket,
        as: "tickets",
        attributes: [],
        required: false,
        through: { attributes: [] }
      }
    ],
    attributes: [
      "id",
      "name",
      "color",
      "kanban",
      [fn("count", col("tickets.id")), "ticketsCount"]
    ],
    group: ["Tag.id"]
  });

  let count = 0;

  Object.keys(counters).forEach(key => {
    count += counters[key].count;
  });

  const hasMore = count > offset + tags.length;

  return {
    tags,
    count,
    hasMore
  };
};

export default ListService;
