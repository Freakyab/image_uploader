"use client";
import React, { useState } from "react";
import { ImageUploadFile, getImages } from "@/app/actions/uploader";
export default function Home() {
  const [imageName, setImageName] = useState<string>("");
  const [allImage, setAllImage] = useState<imageProps[]>([]);
  const [imageUpload, setImageUpload] = useState<boolean>(true);
  React.useEffect(() => {
    if (imageUpload) {
      const fetchImages = async () => {
        const images = await getImages();
        if (images) {
          setAllImage(images);
          setImageUpload(false);
        } else if (!images) {
          console.log("Error fetching images");
        }
      };
      fetchImages();
    }
  }, [imageUpload]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault;
    const file = e.target.files;
    if (file) {
      setImageName(file[0].name);
      const base64 = await convertToBase64(file[0]);
      if (base64) {
        const res = await ImageUploadFile(base64.toString(), imageName);
        if (res) {
          setImageUpload(true);
        } else {
          console.log("Error uploading image");
        }
      }
    }
  };

  const convertToBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };
  return (
    <main className="">
      {imageUpload ? (
        <h1>Image Uploading</h1>
      ) : (
        <div>
          <input type="file" onChange={handleFileUpload} />
          <input
            type="text"
            placeholder="Enter the name"
            value={imageName}
            onChange={(e) => setImageName(e.target.value)}
          />
          {allImage.map((image, index) => (
            <div key={index}>
              <img src={image.link.toString()} alt={image.image.toString()} />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
