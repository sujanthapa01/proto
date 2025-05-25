import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/primsaClient";

export async function POST(req: NextRequest) {
    try {
        const { userid } = await req.json()

        if (!userid) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        const response = await prisma.user.delete({
            where: {
                id: userid
            }
        })
        return NextResponse.json({ ok: true, response }, { status: 200 })

    } catch (err: any) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }


}