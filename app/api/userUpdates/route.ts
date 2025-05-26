import prisma from "@/lib/primsaClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    
const {isPrivate,email} = await req.json()
console.log(isPrivate, email)

try{
    if(!isPrivate || !email){
    return NextResponse.json({ok:false, msg : 'invalid req'}, {status: 404})
}

const updatedUser = await prisma.user.update({
    where : {
       email : email
    },data : {
        private : isPrivate
    }
})

return NextResponse.json({ok: true , updatedUser}, {status: 200})
}catch(error){
    return NextResponse.json({error: 'Invalid server Error'}, {status: 500})
}

}