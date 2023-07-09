import withHandler from "@/libs/server/withHandler";
import withSession from "@/libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@/libs/server/client";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    body: { name, description, price },
    session: {
      user: { id },
    },
  } = req;
  const product = await client?.product.create({
    data: {
      name,
      price: +price,
      description,
      image: "x",
      user: {
        connect: {
          id,
        },
      },
    },
  });
  res.json({ ok: true, product });
}

export default withSession(withHandler({ method: "POST", handler }));
