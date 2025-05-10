"use client";

import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import Image from "next/image";
import { limit } from "../limit";
import { useRouter } from "next/navigation";

function UploadContainer() {
  const [imageName, setImageName] = useState("");
  const [imageUpload, setImageUpload] = useState(false);
  const [image, setImage] = useState("");
  const [percentUploaded, setPercentUploaded] = useState(0);
  const router = useRouter();

  const handleFileUpload = async (file: File) => {
    if (imageName === "") setImageName(file.name);
    const base64 = (await convertToBase64(file)) as string;
    setImage(base64);
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

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      setImageUpload(true);
      const base64 = image;

      // if the total size of the image is greater than 4MB, divide it into 4MB chunks
      const chunkSize = limit; // 4MB
      const chunks = [];

      for (let i = 0; i < base64.length; i += chunkSize) {
        chunks.push(base64.slice(i, i + chunkSize));
      }

      let imageData = [];
      const id = Math.floor(Math.random() * 100000000);

      for (let i = 0; i < chunks.length; i++) {
        console.log("Chunk", i + 1, "of", chunks.length);
        const chunk = chunks[i];
        imageData.push({
          imageString: chunk,
          title: imageName,
          id: id,
          size: (chunk.length * 3) / 4 / (1024 * 1024) 
        });
      }

      for (let i = 0; i < imageData.length; i++) {
        const data = imageData[i];
        //calculate the total size of the image
        const totalSize = data.imageString.length;
        console.log("Total size of the image:", totalSize / 1024 / 1024, "MB");
        const percentage = Math.floor(((i + 1) / imageData.length) * 100);
        setPercentUploaded(percentage);
        console.log("Uploading chunk", i + 1, "of", imageData.length);

        const response = await fetch(
          "http://localhost:8000/post",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );
        const result = await response.json();
        console.log(result);
      }

      if (percentUploaded >= 100) {
        router.push("/view");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setImageUpload(false);
      setImage("");
      setImageName("");
      setPercentUploaded(0);
    }
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
      onDragOver={handleDragOver}>
      {percentUploaded > 0 && (
        <div className="w-full md:w-[80%] bg-gray-200 rounded-lg mt-4">
          <div
            className="bg-blue-500 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-l-lg"
            style={{ width: `${percentUploaded}%` }}>
            {percentUploaded}%
          </div>
        </div>
      )}

      {imageUpload ? (
        <h1>Image loading....</h1>
      ) : (
        <>
          {image === "" ? (
            <>
              <div
                className="w-full md:w-[80%] border-2 border-dashed border-gray-300 p-4 rounded-lg"
                onDrop={handleDrop}
                onDragOver={handleDragOver}>
                <p className="text-center">Drag & drop your image here</p>
              </div>
              <p className="text-center mt-4">Or</p>
              <label
                htmlFor="input-image"
                className="w-full md:w-[80%] flex justify-center items-center mt-4 rounded-lg">
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

              {imageName && (
                <button
                  className="bg-red-500 text-white px-3 py-2 rounded-lg"
                  onClick={() => {
                    setImage("");
                    setImageName("");
                  }}>
                  X
                </button>
              )}
            </div>
          </div>
          <button
            className="bg-blue-500 text-white p-2 px-3 rounded-lg mt-4 capitalize"
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
