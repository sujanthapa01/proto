import prisma from "@/lib/primsaClient"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {

    try {
        const data = await req.json()
        const { messageId } = data
        console.log(messageId)


        if (!messageId) return NextResponse.json({ error: 'messageId is missing' }, { status: 404 })

        const result = await prisma.messeges.delete({
            where: { id: messageId }
        })
        return NextResponse.json({ ok: true, result }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ ok: false, error: 'Inernal server error' }, { status: 500 })
    }

}