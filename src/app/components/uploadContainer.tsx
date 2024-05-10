"use client";

import React, { useState } from "react";
import { ImageUploadFile } from "@/app/actions/uploader";
import { ToastContainer } from "react-toastify";
import { handleToast } from "./HandleToast";

function UploadContainer() {
  const [imageName, setImageName] = useState<string>("");

  const [imageUpload, setImageUpload] = useState<boolean>(false);
  const [image, setImage] = useState<string>("");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.time("file conversion");
    e.preventDefault;
    const file = e.target.files;
    if (file) {
      if (imageName == "") setImageName(file[0].name);
      const base64 = await convertToBase64(file[0]);
      setImage(base64 as string);
      console.timeEnd("file conversion");
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

  const handleSubmit = async () => {
    console.time("image upload");
    setImageUpload(true);
    if (!imageName) {
      handleToast("Please enter the image name", "error");
      return;
    }
    const res = await ImageUploadFile(image, imageName);
    if (res) {
      handleToast("Image uploaded successfully", "success");
    } else {
      handleToast("Error uploading image", "error");
    }
    setImageUpload(false);
    console.timeEnd("image upload");
  };

  return (
    <div className="bg-white w-[90%] h-full flex justify-center items-center flex-col gap-4 p-4 rounded-lg shadow-xl">
      {imageUpload ? (
        <h1>Image loading....</h1>
      ) : (
        <>
          <label htmlFor="input-image">
            <input
              type="file"
              onChange={handleFileUpload}
              id="input-image"
              hidden
            />
          </label>
          <input
            type="text"
            placeholder="Enter the name"
            className="border-2 border-gray-300 p-2 rounded-lg"
            value={imageName}
            onChange={(e) => setImageName(e.target.value)}
            accept=".png, .jpg, .jpeg"
          />
          <button
            className="bg-blue-500 text-white p-2 rounded-lg"
            onClick={handleSubmit}>
            upload
          </button>
        </>
      )}
      <ToastContainer />
    </div>
  );
}

export default UploadContainer;
