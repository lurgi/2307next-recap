import { withIronSessionApiRoute } from "iron-session/next";

declare module "iron-session" {
  interface IronSessionData {
    user: {
      id?: number;
    };
  }
}

const cookieOptions = {
  cookieName: "carrotsession",
  password: process.env.SESSION_PASS!,
};

export default function withSession(fn: any) {
  return withIronSessionApiRoute(fn, cookieOptions);
}
