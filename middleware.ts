import { getIronSession } from "iron-session/edge";
import {
  NextFetchEvent,
  NextRequest,
  NextResponse,
  userAgent,
} from "next/server";

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
  if (req.nextUrl.pathname.startsWith("/chats")) {
    console.log("chats Only middleware");
  }
  if (req.nextUrl.pathname.startsWith("/")) {
    const ua = userAgent(req);
    if (ua?.isBot) {
      return new Response("Plz don't be a bot. Be human.", { status: 403 });
    }
  }
  const res = NextResponse.next();
  const session = await getIronSession(req, res, {
    cookieName: "carrotsession",
    password: process.env.SESSION_PASS!,
    cookieOptions: {
      secure: process.env.NODE_ENV! === "production",
    },
  });
  if (!req.url.includes("/enter") && !session.user) {
    return NextResponse.redirect(new URL("/enter", req.url));
  }
}
export const config = {
  matcher: ["/((?!api|_next/static|favicon.ico).*)"],
};
