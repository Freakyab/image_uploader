"use client";

import React, { useState } from "react";
import { ImageUploadFile } from "@/app/actions/uploader";
import { ToastContainer } from "react-toastify";
import { handleToast } from "./HandleToast";
import Image from "next/image";

function UploadContainer() {
  const [imageName, setImageName] = useState("");
  const [imageUpload, setImageUpload] = useState(false);
  const [image, setImage] = useState("");

  const handleFileUpload = async (file: File) => {
    console.time("file conversion");
    if (imageName === "") setImageName(file.name);
    const base64 = (await convertToBase64(file)) as string;
    setImage(base64);
    console.timeEnd("file conversion");
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
      setImageUpload(false);
      return;
    }
    const res = await ImageUploadFile(image, imageName);
    if (res) {
      handleToast("Image uploaded successfully", "success");
      setImageName("");
      setImage("");
    } else {
      handleToast("Error uploading image \n image size should be less than 3mb", "error");
    }
    setImageUpload(false);
    console.timeEnd("image upload");
  };

  const handleDrop = async (e: any) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFileUpload(file);
  };

  const handleDragOver = (e: any) => {
    e.preventDefault();
  };

  return (
    <div
      className="bg-white w-full md:w-[90%] h-full flex flex-col justify-center items-center p-4 rounded-lg shadow-xl"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {imageUpload ? (
        <h1>Image loading....</h1>
      ) : (
        <>
          {image === "" ? (
            <>
              <div
                className="w-full md:w-[80%] border-2 border-dashed border-gray-300 p-4 rounded-lg"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <p className="text-center">Drag & drop your image here</p>
              </div>
              <p className="text-center mt-4">Or</p>
              <label
                htmlFor="input-image"
                className="w-full md:w-[80%] flex justify-center items-center mt-4 rounded-lg"
              >
                <input
                  type="file"
                  onChange={(e) =>
                    e.target.files && handleFileUpload(e.target.files[0])
                  }
                  id="input-image"
                  hidden
                />
                <p className="cursor-pointer flex items-end h-full capitalize">
                  Click to open the file
                </p>
              </label>
            </>
          ) : (
            <div className="w-fit">
              <Image
                src={image}
                alt="uploaded image"
                className="object-cover h-[500px] rounded-lg"
                width={500}
                height={500}
              />
            </div>
          )}
          <div className="w-full md:w-[80%] flex flex-col md:flex-row justify-center items-center gap-4 mt-4">
            <p className="text-lg">Enter the image name</p>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Enter the name"
                className="border-2 border-gray-300 p-2 rounded-lg w-full md:w-[60%]"
                value={imageName}
                onChange={(e) => setImageName(e.target.value)}
                accept=".png, .jpg, .jpeg"
              />

              {imageName && <button
                className="bg-red-500 text-white px-3 py-2 rounded-lg"
                onClick={() => {
                  setImage("");
                  setImageName("");
                }}
              >
                X
              </button>}
            </div>
          </div>
          <button
            className="bg-blue-500 text-white p-2 px-3 rounded-lg mt-4 capitalize"
            onClick={handleSubmit}
          >
            upload
          </button>
        </>
      )}
      <ToastContainer />
    </div>
  );
}

export default UploadContainer;