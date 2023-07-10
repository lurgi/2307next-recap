import withHandler from "@/libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@/libs/server/client";
import withSession from "@/libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    session: { user },
  } = req;
  const alreadyExist = await client.fav.findFirst({
    where: {
      productId: +id?.toString()!,
      userId: user.id,
    },
  });
  if (alreadyExist) {
    await client.fav.delete({
      where: {
        id: alreadyExist.id,
      },
    });
  } else {
    await client.fav.create({
      data: {
        user: {
          connect: {
            id: user.id,
          },
        },
        product: {
          connect: {
            id: +id?.toString()!,
          },
        },
      },
    });
  }
  res.json({ ok: true });
}

export default withSession(withHandler({ methods: ["POST"], handler }));
