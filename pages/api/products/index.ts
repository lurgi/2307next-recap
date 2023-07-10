import withHandler from "@/libs/server/withHandler";
import withSession from "@/libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@/libs/server/client";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const products = await client.product.findMany();
    res.json({ ok: true, products });
  }
  if (req.method === "POST") {
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
}

export default withSession(withHandler({ methods: ["POST", "GET"], handler }));
