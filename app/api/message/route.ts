import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/primsaClient";
export async function POST(req: NextRequest) {
    try {

        const data = await req.json()
        const { message, userId }: { message: string, userId: string } = data

        if (!message) {
            return NextResponse.json({ error: 'no name provided' }, { status: 400 })
        }
        const user = await prisma.messeges.create({
            data: {
                userId: userId,
                content: message
            }
        })
        console.log(user)


        return NextResponse.json({ ok: true, user }, { status: 200 })
    } catch (error) {
        console.error('Error processing data:', error);
        return NextResponse.json({ error: 'internal server error' }, { status: 500 })

    }
}



