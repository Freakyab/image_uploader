
import { getImageLink } from "@/app/actions/uploader";
import Image from "next/image";

export default async function Page({ params }: { params: { id: string } }) {
    const image = await getImageLink(params.id);
    return <Image src={image? image.link : ""} width={500} height={500} alt={image? image.image : "image"} />
}

