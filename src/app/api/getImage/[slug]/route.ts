import { NextRequest, NextResponse } from "next/server";
import { getImageLink } from "@/app/actions/uploader";

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const id = params.slug.toString();
    const image = await getImageLink(id);

    if (image === null) {
      return new NextResponse("Image not found", { status: 404 });
    } else {
      const imageLink = image.link;
      const response = NextResponse.json({ imageUrl: imageLink });

      // Set CORS headers
      response.headers.set("Access-Control-Allow-Origin", "*");
      response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
      response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

      return response;
    }
  } catch (err) {
    console.log(err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
