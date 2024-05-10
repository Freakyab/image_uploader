import { NextRequest, NextResponse } from "next/server";
import { getImageLink } from "@/app/actions/uploader";

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
    try {
        const id = params.slug.toString();
        const image = await getImageLink(id);
        if (image === null) {
            return NextResponse.error();
        } else {
            const imageLink = image.link;
            return NextResponse.json(imageLink);
        }
    } catch (err) {
        console.log(err);
        return NextResponse.error();
    }
}