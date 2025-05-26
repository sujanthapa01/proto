import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/primsaClient";
export async function POST(req: NextRequest) {
    try {

        const data = await req.json()
        const { name }: { name: string } = data

        if (!name) {
            return NextResponse.json({ error: 'no name provided' }, { status: 400 })
        }
       const user =  await prisma.user.create({
            data: {
                name
            }
        })
 console.log(user)


      return NextResponse.json({ ok: true,user }, { status: 200 })
    } catch (error) {
        console.error('Error processing data:', error);
        return NextResponse.json({ error: 'internal server error' }, { status: 500 })

    }
}



