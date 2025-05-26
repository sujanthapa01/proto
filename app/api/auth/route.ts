import { NextRequest } from "next/server";
import prisma from "@/lib/primsaClient"; 
import { NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userMail: email , password, type } = body;
    
    console.log("body", body);

    if (!type || !["login", "signup", "logout"].includes(type)) {
      return NextResponse.json({ msg: "Invalid type" }, { status: 400 });
    }

    // if (!email ) {
    //   return NextResponse.json(
    //     { msg: "email required" },
    //     { status: 400 }
    //   );
    // }

    if (type === "login") {

      const user = await prisma.user.update({
        where: { email },
        data: { is_login: true },
      });

      return NextResponse.json({ ok: true, user }, { status: 200 });
    } else if (type === "signup") {
      const user = await prisma.user.create({
        data: { email, password },
      });

      return NextResponse.json({ ok: true, user }, { status: 200 });
    } else if (type === "logout") {
      console.log("logout trigred")
            console.log("Logout triggered for:", email);

      const user = await prisma.user.update({
        where: { email },
        data: { is_login: false },
      });

      return NextResponse.json({ ok: true, user }, { status: 200 });
    }

    return NextResponse.json({ ok: false, msg: "Invalid request" }, { status: 404 });
  } catch (e) {
    console.error("Error in API:", e);
    return NextResponse.json(
      { error: "Internal server error", details: e },
      { status: 500 }
    );
  }
}
