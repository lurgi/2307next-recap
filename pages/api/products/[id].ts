import withHandler from "@/libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@/libs/server/client";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const detail = await client.product.findUnique({
    where: {
      id: +id?.toString()!,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });
  const terms = detail?.name.split(" ").map((v) => ({
    name: {
      contains: v,
    },
  }));
  const relativeProducts = await client.product.findMany({
    where: {
      OR: terms,
      AND: {
        id: {
          not: detail?.id,
        },
      },
    },

    take: 4,
  });
  res.json({ ok: true, detail, relativeProducts });
}

export default withHandler({ methods: ["GET"], handler });
