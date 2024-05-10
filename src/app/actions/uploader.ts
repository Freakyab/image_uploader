'use server';
import db from '@/db';

export async function ImageUploadFile(link: string, name: string) {
    try {
        await db.imageUploader.create({
            data: {
                image: name,
                link: link
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
      
      console.log(images);
      return images.reverse(); // Reverse the order if needed
    } catch (err) {
      console.error(err);
      return false;
    }
  }

export async function totalLength(){
    try {
        // if (index === 0) then return last 2 images
        // else total size  - index images slice 2 images
        const images = await db.imageUploader.findMany();

        return images.length;
    } catch (err) {
        console.error(err);
        return 0;
    }
}


// Function to calculate the total size of images
async function calculateSize(images: imageProps[]): Promise<number> {
    let totalSize = 0;
    let index = 0;
    for (const image of images) {
        // Assuming each image object has an ID and you fetch the document size from the database
        const document = await db.imageUploader.findUnique({ where: { id: image.id } });
        totalSize += calculateDocumentSize(document);
        index++;
        if (totalSize > 4 * 1024 * 1024) {
            break;
        }
    }

    return index;
}

// Function to calculate the size of the document
function calculateDocumentSize(document: any): number {
    // Implement your logic to calculate the size of the document
    // For example, you can convert the document to a string and calculate its length
    const documentString = JSON.stringify(document);
    return Buffer.byteLength(documentString, 'utf-8');
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