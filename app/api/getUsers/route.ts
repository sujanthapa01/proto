import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/primsaClient";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const name = searchParams.get("name");

  try {
    const users= await prisma.user.findMany({
      where: name ? { name } : {}
    });

const data = users.filter((user) => !user.private)
console.log("getuser data : ",data)

    return NextResponse.json({ data, success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
