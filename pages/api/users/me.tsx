import client from "@/libs/server/client";
import withHandler from "@/libs/server/withHandler";
import withSession from "@/libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";

async function me(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.session.user;
  const user = await client.user.findUnique({
    where: {
      id,
    },
  });

  res.json({ ok: true, user });
}

export default withSession(withHandler("GET", me));
