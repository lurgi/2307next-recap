import client from "@/libs/server/client";
import withHandler from "@/libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import smtpTransport from "./email";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email, phone } = req.body;
  if (phone) {
    return res.status(401).end();
  }
  const user = phone ? { phone: +phone } : { email };
  const payload = Math.floor(100000 + Math.random() * 90000) + "";
  console.log(process.env.MAIL_ID, process.env.MAIL_PASS);
  const mailOptions = {
    from: `${process.env.MAIL_ID}@naver.com`,
    to: email,
    subject: "확인용 이메일 입니다",
    text: `인증 번호는 ${payload} 입니다`,
  };
  const result = smtpTransport.sendMail(mailOptions, (error, response) => {
    if (error) {
      console.log(error);
      return;
    } else {
      console.log(response);
      return;
    }
  });
  smtpTransport.close();
  console.log(result);
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
  return res.json({
    ok: true,
  });
}

export default withHandler("POST", handler);
