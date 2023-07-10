import withHandler from "@/libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@/libs/server/client";
import withSession from "@/libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    session: { user },
  } = req;
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
  const isLike = Boolean(
    await client.fav.findFirst({
      where: {
        userId: user.id,
        productId: +id?.toString()!,
      },
      select: {
        id: true,
      },
    })
  );
  res.json({ ok: true, detail, relativeProducts, isLike });
}

export default withSession(withHandler({ methods: ["GET"], handler }));
