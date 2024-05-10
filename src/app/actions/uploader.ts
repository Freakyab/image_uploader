'use server';
import db from '@/db';

export async function ImageUploadFile(link : string , name: string){
    try {
        await db.imageUploader.create({
            data : {
                image : name,
                link : link
            }
        })

        return true;
    }catch(err){
        console.log(err);
        return false;
    }
}

export async function getImages(){
    try {
        const images = await db.imageUploader.findMany();
        return images.reverse();
    }catch(err){
        console.log(err);
        return [];
    }
}   

export async function deleteImage(id : string){
    try {
        await db.imageUploader.delete({
            where : {
                id : id
            }
        })
        return true;
    }catch(err){
        console.log(err);
        return false;
    }
}

export async function getImageLink(id : string){
    try {
        const image = await db.imageUploader.findUnique({
            where : {
                id : id
            }
        })
        return image;
    }catch(err){
        console.log(err);
        return null;
    }
}