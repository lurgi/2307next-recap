import withHandler from "@/libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@/libs/server/client";
import withSession from "@/libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { token } = req.body;
  const exists = await client.token.findUnique({
    where: {
      payload: token,
    },
  });
  if (!exists) res.status(400).end();
  req.session.user = {
    id: exists?.userId!,
  };
  await req.session.save();
  await client.token.deleteMany({
    where: {
      userId: exists?.userId,
    },
  });
  res.json({ ok: true });
}

export default withSession(withHandler({ methods: ["POST"], handler }));
