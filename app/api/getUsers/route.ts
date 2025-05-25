import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/primsaClient";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const name = searchParams.get("name");

  try {
    const data = await prisma.user.findMany({
      where: name ? { name } : {}
    });

    return NextResponse.json({ data, success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
