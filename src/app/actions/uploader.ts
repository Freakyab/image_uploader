'use server';
import db from '@/db';

export async function ImageUploadFile(link: string, name: string) {
    try {
        await db.imageUploader.create({
            data: {
                image: name,
                link: link,
                visibility: true
            }
        })

        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}

export async function getImages(index: number): Promise<imageProps[] | false> {
    try {
      const images = await db.imageUploader.findMany({
        skip: index, // Skip the first 'index' images
        take: 2, // Take 2 images per request (pagination)
      });
      
      return images; // Reverse the order if needed
    } catch (err) {
      console.error(err);
      return false;
    }
  }

export async function totalLength(){
    try {
        const images = await db.imageUploader.findMany();
        return images.length;
    } catch (err) {
        console.error(err);
        return 0;
    }
}


export async function changeVisibility(id: string, visibility: boolean) {
    try {
        const change = await db.imageUploader.update({
            where: {
                id: id
            },
            data: {
                visibility: visibility
            }
        })
        if(change) return true;
        else return false;
    } catch (err) {
        console.log(err);
        return false;
    }
}

export async function deleteImage(id: string) {
    try {
        await db.imageUploader.delete({
            where: {
                id: id
            }
        })
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}

export async function getImageLink(id: string) {
    try {
        const image = await db.imageUploader.findUnique({
            where: {
                id: id
            }
        })
        return image;
    } catch (err) {
        console.log(err);
        return null;
    }
}