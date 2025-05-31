import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/primsaClient";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const content = searchParams.get("message");

  try {
    const users = await prisma.messeges.findMany({
      where: content ? { content } : {}
    });


    console.log("getuser data : ", users)
    const data = users.filter((msg) => !msg.private)

    return NextResponse.json({ data, success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
