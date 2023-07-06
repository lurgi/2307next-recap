import client from "@/libs/server/client";
import withHandler from "@/libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email, phone } = req.body;
  const user = phone ? { phone: +phone } : { email };
  const payload = Math.floor(100000 + Math.random() * 90000) + "";
  const token = await client.token.create({
    data: {
      payload,
      user: {
        connectOrCreate: {
          create: {
            name: "Anonymous",
            ...user,
          },
          where: {
            ...user,
          },
        },
      },
    },
  });
  console.log(token);
  return res.status(200).end();
}

export default withHandler("POST", handler);
